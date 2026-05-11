import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties & {
    color?: string;
    borderColor?: string;
  };
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  disabled,
  style,
}) => {
  const color = style?.color ?? "white";
  const borderColor = style?.borderColor ?? "#e5e7eb";

  return (
    <div
      className="searchbar-wrap"
      style={{ "--sb-color": color, "--sb-border": borderColor } as React.CSSProperties}
    >
      <svg className="searchbar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className="searchbar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {value && (
        <button className="searchbar-clear" onClick={() => onChange("")} aria-label="Clear">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;