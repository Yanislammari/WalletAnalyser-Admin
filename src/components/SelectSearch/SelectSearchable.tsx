import { useState, useRef, useEffect } from "react";
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
  onChange: (uuid: string) => void;
  onEscape?: () => void;
  placeholder?: string;
  emptyMessage?: string;
}

export function SelectSearchable({
  value,
  options,
  onChange,
  onEscape,
  placeholder = "Search...",
  emptyMessage = "No results",
}: SelectSearchableProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [listPos, setListPos] = useState({ top: 0, left: 0, width: 0 });
  const openRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = options.find((opt) => opt.uuid === value)?.label ?? "";

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
  };

  const handleClose = () => {
    setSearch("");
    openRef.current = false;
    setOpen(false);
  };

  const handleToggle = () => {
    if (openRef.current) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // ignore clicks on the trigger — it handles itself via onClick
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
        return;
      }
      // close if clicking outside the portal
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        if (openRef.current) handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div ref={anchorRef} style={{ width: 0, height: 0, overflow: "hidden" }} />

      {/* trigger button — always visible */}
      <button
        ref={triggerRef}
        className={`select-searchable__trigger ${open ? "select-searchable__trigger--open" : ""}`}
        onClick={handleToggle}
        type="button"
      >
        <span>{selectedLabel || placeholder}</span>
        <span className="select-searchable__chevron">{open ? "▲" : "▼"}</span>
      </button>

      {/* portal — only rendered when open */}
      {open && createPortal(
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
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="select-searchable__list">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li
                  key={opt.uuid}
                  className={`select-searchable__item ${opt.uuid === value ? "select-searchable__item--selected" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(opt.uuid); handleToggle(); }}
                >
                  {opt.label}
                </li>
              ))
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