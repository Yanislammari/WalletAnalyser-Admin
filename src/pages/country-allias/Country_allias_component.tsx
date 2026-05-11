import { useState, useRef, useEffect } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import type { CountryNameAlliasResponse } from "../../payloads/CountryPayload";
import Loading from "../../components/Loading";

/* ───────────────────── EditToggle ───────────────────── */

interface EditToggleProps {
  value: string;
  onSave: (newValue: string) => void;
  onDelete: () => void;
}

function EditToggle({ value, onSave, onDelete }: EditToggleProps) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleEdit = () => {
    setInputValue(value);
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
    setInputValue(value);
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <td className="email-cell">{value}</td>
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
        <td className="email-cell">{value}</td>
        <td></td>
        <td>
          <button className="edit-btn" onClick={(e)=>{e.stopPropagation
          handleEdit()}
        } title="Edit">
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
      <td></td>
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={handleSave} title="Save changes">
            Save
          </button>
            <ConfirmDialog
              title="Delete allias country"
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

/* ───────────────────── CountryRow ───────────────────── */

export interface CountryAlliasRowProps {
  country_allias: CountryNameAlliasResponse;
  onSave?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function CountryAlliasRow({ country_allias, onSave, onDelete, onClick }: CountryAlliasRowProps) {
  return (
    <tr onClick={()=>onClick?.()}>
      <EditToggle
        value={country_allias.country_allias_name}
        onSave={(newName) => onSave?.(country_allias.uuid, newName)}
        onDelete={() => onDelete?.(country_allias.uuid)}
      />
    </tr>
  );
}
