import "./Pagination.css"
import { useEffect, useState } from "react";

const LIMIT_OPTIONS = [25, 50, 100];

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
  const [selected, setSelected] = useState<number>(limit);

  const availableOptions = LIMIT_OPTIONS.filter((opt) => opt <= total);

  useEffect(() => {
    if (total < LIMIT_OPTIONS[0]) {
      setSelected(total);
      return;
    }
    const closest = availableOptions.reduce((prev, curr) =>
      Math.abs(curr - limit) < Math.abs(prev - limit) ? curr : prev
    );
    setSelected(closest);
  }, [limit, total]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelected(value);
    onGoTo(value);
  };

  const style = accentColor ? ({ "--pagination-accent": accentColor } as React.CSSProperties) : undefined;

  return (
    <div className="pagination">
      <div className="pagination-info">
        <select
          className="pagination-input"
          value={selected}
          disabled={disabled || availableOptions.length === 0}
          onChange={handleChange}
          style={style}
        >
          {availableOptions.length === 0 ? (
            <option value={total} style={{ color: "black" }}>{total}</option>
          ) : (
            availableOptions.map((opt) => (
              <option key={opt} value={opt} style={{ color: "black" }}>
                {opt}
              </option>
            ))
          )}
        </select>
        <span className="pagination-total" style={{ color: accentColor}}>/ {total} elements</span>
      </div>
    </div>
  );
};