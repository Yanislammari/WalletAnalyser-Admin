import React from "react";
import "./SearchBar.css";

interface DateRangeBarProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties & {
    color?: string;
    borderColor?: string;
  };
}

// "20250103" or "2025-01-03" → "03/01/2025"
const toDisplay = (iso: string): string => {
  const clean = iso.replace(/-/g, "");
  if (clean.length !== 8) return iso;
  return `${clean.slice(6, 8)}/${clean.slice(4, 6)}/${clean.slice(0, 4)}`;
};

// "03/01/2025" → "2025-01-03" (only when fully typed)
const toIso = (display: string): string => {
  const parts = display.split("/");
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return "";
};

const maskInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += "/";
    result += digits[i];
  }
  return result;
};

interface MaskedDateInputProps {
  value: string; // ISO
  onChange: (iso: string) => void;
  min?: string; // ISO
  max?: string; // ISO
  disabled?: boolean;
}

const MaskedDateInput: React.FC<MaskedDateInputProps> = ({ value, onChange, disabled }) => {
  const [display, setDisplay] = React.useState(value ? toDisplay(value) : "");

  // Sync display when parent resets value (e.g. clear button)
  React.useEffect(() => {
    setDisplay(value ? toDisplay(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskInput(e.target.value);
    setDisplay(masked);
    const iso = toIso(masked);
    if (iso || masked === "") onChange(iso);
  };

  return (
    <input
      style={{marginRight : "-65px"}}
      type="text"
      className="searchbar-input-date"
      value={display}
      placeholder="JJ/MM/AAAA"
      onChange={handleChange}
      disabled={disabled}
      maxLength={10}
    />
  );
};

export const DateRangeBar: React.FC<DateRangeBarProps> = ({
  from,
  to,
  onFromChange,
  onToChange,
  disabled,
  style,
}) => {
  const color = style?.color ?? "white";
  const borderColor = style?.borderColor ?? "#e5e7eb";

  return (
    <div
      className="searchbar-wrap"
      style={{ "--sb-color": color, "--sb-border": borderColor} as React.CSSProperties}
    >
      <svg className="searchbar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <MaskedDateInput value={from} onChange={onFromChange} max={to} disabled={disabled} />

      <span style={{ color, opacity: 0.5, flexShrink: 0 }}>→</span>

      <MaskedDateInput value={to} onChange={onToChange} min={from} disabled={disabled} />

      {(from || to) && (
        <button
          className="searchbar-clear"
          onClick={() => { onFromChange(""); onToChange(""); }}
          aria-label="Effacer les dates"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default DateRangeBar;