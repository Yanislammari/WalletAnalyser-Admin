import { useState } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import Loading from "../../components/Loading";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import type { ForexRateShort } from "../../payloads/ForexRatesPayload";

registerLocale("fr", fr);

interface EditToggleProps {
  value: ForexRateShort;
  onSave: (newDate: Date | null, newRate: number | null) => void;
  onDelete: () => void;
}

function EditToggle({ value, onSave, onDelete }: EditToggleProps) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editRate, setEditRate] = useState<number | null>(null);

  const handleEdit = () => {
    setEditDate(new Date(value.forex_rate_date));
    setEditRate(value.forex_rate);
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(editDate, editRate);
    setLoading(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDelete();
    setLoading(false);
    setEditing(false);
  };

  const handleExit = () => {
    setEditDate(null);
    setEditRate(null);
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <td className="email-cell">{new Date(value.forex_rate_date).toLocaleDateString("fr-FR")}</td>
        <td className="email-cell">{value.forex_rate}</td>
        <td></td>
        <td>
          <Loading style={{ width: "100%", height: "100%" }} fullPage={false} spinnerSize={20} />
        </td>
      </>
    );
  }

  if (!editing) {
    return (
      <>
        <td className="email-cell">{new Date(value.forex_rate_date).toLocaleDateString("fr-FR")}</td>
        <td className="email-cell">{value.forex_rate}</td>
        <td></td>
        <td></td>
        <td>
          <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(); }} title="Edit">
            Edit
          </button>
        </td>
      </>
    );
  }

  return (
    <>
      <td className="email-cell" style={{ minWidth: "185px" }}>
        <DatePicker
          wrapperClassName="accordion-datepicker-wrapper"
          className="accordion-input"
          selected={editDate}
          onChange={(date: Date | null) => setEditDate(date)}
          onChangeRaw={(e) => {
            if (!e || e.type !== "change") return;
            const input = e.target as HTMLInputElement;
            const prev = input.getAttribute("data-prev") ?? "";
            let val = input.value.replace(/[^\d/]/g, "");
            const isDeleting = val.length < prev.length;
            if (!isDeleting) {
              if (val.length === 2 && !val.includes("/")) val += "/";
              if (val.length === 5 && val.split("/").length - 1 === 1) val += "/";
            }
            input.setAttribute("data-prev", val);
            input.value = val;
          }}
          locale="fr"
          placeholderText="jj/mm/aaaa"
          dateFormat="dd/MM/yyyy"
          disabled={loading}
          showIcon
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          isClearable
          autoComplete="off"
        />
      </td>
      <td className="email-cell">
        <input
          className="edit-input"
          type="number"
          value={editRate ?? ""}
          onChange={(e) => setEditRate(e.target.value === "" ? null : Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleExit();
          }}
          placeholder="1.234"
        />
      </td>
      <td></td>
      <td></td>
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={handleSave} title="Save changes">
            Save
          </button>
          <ConfirmDialog
            title="Delete Forex rate"
            description="This will permanently delete this entry. This action cannot be undone."
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleDelete}
          >
            <button className="action-btn delete-btn" title="Delete">
              Delete
            </button>
          </ConfirmDialog>
          <button className="action-btn exit-btn" onClick={handleExit} title="Cancel editing">
            Exit
          </button>
        </div>
      </td>
    </>
  );
}

export interface ForexRateRowProps {
  forexRate: ForexRateShort;
  onSave?: (id: string, newDate: Date | null, newRate: number | null) => void;
  onDelete?: (id: string) => void;
}

export function ForexRateRow({ forexRate, onSave, onDelete }: ForexRateRowProps) {
  return (
    <tr>
      <EditToggle
        value={forexRate}
        onSave={(newDate, newRate) => onSave?.(forexRate.uuid, newDate, newRate)}
        onDelete={() => onDelete?.(forexRate.uuid)}
      />
    </tr>
  );
}
