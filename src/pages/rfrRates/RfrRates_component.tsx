import { useState, useRef, useEffect } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import type { RiskFreeRateShort } from "../../payloads/RfrRatesPayload";
import Loading from "../../components/Loading";

/* ───────────────────── EditToggle ───────────────────── */

interface EditToggleProps {
  value: RiskFreeRateShort;
  onSave: (newValue: string) => void;
  onDelete: () => void;
}

function EditToggle({ value, onSave, onDelete }: EditToggleProps) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleEdit = () => {
    setInputValue("");
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(inputValue);
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
    setInputValue("");
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <td className="email-cell">{new Date(value.rfr_date).toLocaleDateString("fr-FR")}</td>
        <td className="email-cell">{value.rfr_percent_rate}</td>
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
        <td className="email-cell">{new Date(value.rfr_date).toLocaleDateString("fr-FR")}</td>
        <td className="email-cell">{value.rfr_percent_rate}%</td>
        <td></td>
        <td></td>
        <td>
          <button className="edit-btn" onClick={(e)=>{e.stopPropagation()
          handleEdit()}} title="Edit">
            Edit
          </button>
        </td>
      </>
    );
  }

  return (
    <>
      <td className="email-cell">
        <input
          ref={inputRef}
          className="edit-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleExit();
          }}
        />
      </td>
      <td className="email-cell">{value.rfr_percent_rate}%</td>
      <td></td>
      <td></td>
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={handleSave} title="Save changes">
            Save
          </button>
            <ConfirmDialog
              title="Delete RFR rate"
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

/* ───────────────────── RfrRateRow ───────────────────── */

export interface RfrRateRowProps {
  rfr_rate: RiskFreeRateShort;
  onSave?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function RfrRateRow({ rfr_rate, onSave, onDelete, onClick }: RfrRateRowProps) {
  return (
    <tr onClick={()=>onClick?.()}>
      <EditToggle
        value={rfr_rate}
        onSave={(newName) => onSave?.(rfr_rate.uuid, newName)}
        onDelete={() => onDelete?.(rfr_rate.uuid)}
      />
    </tr>
  );
}