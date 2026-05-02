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
      style={{ "--sb-color": color, "--sb-border": borderColor, gap: "8px" } as React.CSSProperties}
    >
      <svg className="searchbar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <input
        type="date"
        className="searchbar-input-date"
        value={from}
        max={to || undefined}
        onChange={(e) => onFromChange(e.target.value)}
        disabled={disabled}
      />

      <span style={{ color, opacity: 0.5, flexShrink: 0 }}>→</span>

      <input
        type="date"
        className="searchbar-input-date"
        value={to}
        min={from || undefined}
        onChange={(e) => onToChange(e.target.value)}
        disabled={disabled}
      />

      {(from || to) && (
        <button
          className="searchbar-clear"
          onClick={() => { onFromChange(""); onToChange(""); }}
          aria-label="Clear dates"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default DateRangeBar;
