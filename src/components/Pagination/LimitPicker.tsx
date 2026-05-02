import "./Pagination.css"
import { useEffect, useState } from "react";

interface LimitPickerProps {
  limit: number;
  total: number;
  onGoTo: (limit: number) => void | Promise<void>;
  disabled?: boolean;
  accentColor?: string;
}

export const LimitPicker: React.FC<LimitPickerProps> = ({
  limit,
  total,
  onGoTo,
  disabled,
  accentColor,
}) => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    setInput(String(limit));
  }, [limit]);

  const handleGoTo = () => {
    const value = parseInt(input);
    if (!isNaN(value) && value >= 1 && value <= total) {
      onGoTo(value);
    } else {
      setInput(String(limit)); // reset if invalid
    }
  };

  const style = accentColor
    ? ({ "--pagination-accent": accentColor } as React.CSSProperties)
    : undefined;

  return (
    <div className="pagination" style={style}>
      <div className="pagination-info">
        <input
          type="number"
          className="pagination-input"
          value={input}
          min={1}
          max={total}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
          onBlur={handleGoTo}
        />
        <span className="pagination-sep">/</span>
        <span className="pagination-total">{total} elements</span>
      </div>
    </div>
  );
};
