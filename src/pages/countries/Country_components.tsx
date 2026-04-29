import { useState, useRef, useEffect } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import Loading from "../../components/Loading";

/* ───────────────────── EditToggle ───────────────────── */

interface EditToggleProps {
  value: string;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (newValue: string) => void;
  onDelete: () => void;
}

function EditToggle({ value, editing, setEditing, onSave, onDelete }: EditToggleProps) {
  const [loading, setLoading] = useState(false);

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
        <td>
          <button className="edit-btn" onClick={(e)=>{
            e.stopPropagation();
            handleEdit()
          }} title="Edit">
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
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={(e)=>{
            e.stopPropagation()
            handleSave()
          }} title="Save changes">
            Save
          </button>
          <ConfirmDialog
            title="Delete country"
            description="This will permanently delete this entry. This action cannot be undone."
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleDelete}
          >
            <button
              className="action-btn delete-btn"
              title="Delete"
            >
              Delete
            </button>
          </ConfirmDialog>
          <button className="action-btn exit-btn" onClick={(e)=>{
            e.stopPropagation();
            handleExit();
          }} title="Cancel editing">
            Exit
          </button>
        </div>
      </td>
    </>
  );
}

/* ───────────────────── CountryRow ───────────────────── */

export interface CountryRowProps {
  country: CountryNameResponse;
  onSave?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

export function CountryRow({ country, onSave, onDelete, onClick }: CountryRowProps) {
  const [editing, setEditing] = useState<boolean>(false);
  return (
    <tr onClick={()=>{
      if(!editing) {
        onClick?.()
      }
    }} style={{ cursor: "pointer" }}>
      <EditToggle
        value={country.country_name}
        editing={editing}
        setEditing={setEditing}
        onSave={(newName) => onSave?.(country.uuid, newName)}
        onDelete={() => onDelete?.(country.uuid)}
      />
    </tr>
  );
}
