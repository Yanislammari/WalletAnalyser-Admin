import "./Pagination.css"
import { useEffect, useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
  onGoTo: (page: number) => void | Promise<void>;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onGoTo,
  disabled
}) => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    setInput(String(currentPage));
  }, [currentPage]);

  const handleGoTo = () => {
    const page = parseInt(input);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onGoTo(page);
    } else {
      setInput(String(currentPage)); // reset if invalid
    }
  };


  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={onPrev}
        disabled={currentPage <= 1 || disabled}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className="pagination-info">
      <input
        type="number"
        className="pagination-input"
        value={input}
        min={1}
        max={totalPages}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
        onBlur={handleGoTo}
      />
        <span className="pagination-sep">/</span>
        <span className="pagination-total">{totalPages}</span>
      </div>

      <button
        className="pagination-btn"
        onClick={onNext}
        disabled={currentPage >= totalPages || disabled}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};