import { useState, useRef, useEffect, useCallback } from "react";
import "./SelectSearchable.css";
import { createPortal } from "react-dom";

export interface SelectOption {
  uuid: string;
  label: string;
}

export function toSelectOptions<T>(
  items: T[] | string[],
  getUuid?: (item: T) => string,
  getLabel?: (item: T) => string
): SelectOption[] {
  if (!getUuid || !getLabel) {
    return (items as string[]).map((s) => ({ uuid: s, label: s }));
  }
  return (items as T[]).map((item) => ({
    uuid: getUuid(item),
    label: getLabel(item),
  }));
}

interface SelectSearchableProps {
  value: string;
  options: SelectOption[];
  onChange: (opt: SelectOption) => void;
  onEscape?: () => void;
  placeholder?: string;
  emptyMessage?: string;
  loadMore?: (search: string, offset: number) => Promise<SelectOption[]>;
}

export function SelectSearchable({value, options, onChange, onEscape, placeholder = "Search..." , emptyMessage = "No results", loadMore}: SelectSearchableProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [listPos, setListPos] = useState({ top: 0, left: 0, width: 0 });
  const openRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef(false);

  const selectedLabel = options.find((opt) => opt.uuid === value)?.label ?? value;

  // ── Loader ────────────────────────────────────────────────────────────────

  const fetchMore = useCallback(
    async (currentSearch: string, offset: number, replace: boolean) => {
      if (!loadMore || loadingRef.current) return;
      if (!replace && !hasMore) return;

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const newItems = await loadMore(currentSearch, offset);
        setLoadedOptions((prev) => (replace ? newItems : [...prev, ...newItems]));
        setHasMore(newItems.length > 0);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [loadMore, hasMore]
  );

  // ── Open / Close ──────────────────────────────────────────────────────────

  const updatePos = () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setListPos({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 5,
        width: 220,
      });
    }
  };

  const handleOpen = () => {
    updatePos();
    openRef.current = true;
    setOpen(true);
    if (loadMore) {
      setLoadedOptions([]);
      setHasMore(true);
      fetchMore("", 0, true);
    }
  };

  const handleClose = () => {
    setSearch("");
    openRef.current = false;
    setOpen(false);
    if (loadMore) {
      setLoadedOptions([]);
      setHasMore(true);
    }
  };

  const handleToggle = () => {
    if (openRef.current) handleClose();
    else handleOpen();
  };

  // ── Focus search on open ──────────────────────────────────────────────────

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // ── Click-outside ─────────────────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        if (openRef.current) handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Escape key ────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current) {
        handleClose();
        onEscape?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── Search change → reload from offset 0 ─────────────────────────────────

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (!loadMore) return;
    setLoadedOptions([]);
    setHasMore(true);
    fetchMore(val, 0, true);
  };

  // ── Scroll-to-bottom → load next page ────────────────────────────────────

  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (!list || !loadMore || !hasMore || loadingRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      fetchMore(search, loadedOptions.length, false);
    }
  }, [loadMore, hasMore, search, loadedOptions.length, fetchMore]);

  // ── Displayed options ─────────────────────────────────────────────────────

  const displayOptions = loadMore
    ? loadedOptions
    : options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div ref={anchorRef} style={{ width: 0, height: 0, overflow: "hidden" }} />

      <button
        ref={triggerRef}
        className={`select-searchable__trigger ${open ? "select-searchable__trigger--open" : ""}`}
        onClick={handleToggle}
        type="button"
      >
        <span>{selectedLabel || placeholder}</span>
        <span className="select-searchable__chevron">{open ? "▲" : "▼"}</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={portalRef}
            className="select-searchable__portal"
            style={{
              position: "absolute",
              top: listPos.top,
              left: listPos.left,
              width: listPos.width,
              zIndex: 9999,
            }}
          >
            <input
              ref={searchRef}
              className="select-searchable__search"
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={handleSearchChange}
            />
            <ul
              ref={listRef}
              className="select-searchable__list"
              onScroll={handleScroll}
            >
              {displayOptions.length > 0 ? (
                <>
                  {displayOptions.map((opt) => (
                    <li
                      key={opt.uuid}
                      className={`select-searchable__item ${
                        opt.uuid === value ? "select-searchable__item--selected" : ""
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onChange(opt);
                        handleToggle();
                      }}
                    >
                      {opt.label}
                    </li>
                  ))}
                  {isLoading && (
                    <li className="select-searchable__loading">Loading…</li>
                  )}
                </>
              ) : isLoading ? (
                <li className="select-searchable__loading">Loading…</li>
              ) : (
                <li className="select-searchable__empty">{emptyMessage}</li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}
