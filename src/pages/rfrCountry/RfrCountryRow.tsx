import { useState, useRef, useEffect, useMemo } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import Loading from "../../components/Loading";
import type { RfrCountryItem } from "../../payloads/RfrCountryPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";

/* ───────────────────── EditToggle ───────────────────── */

interface EditToggleProps {
  countryName: string;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  lastUpdate: string;
  options: CountryNameResponse[];
  onSave: (newUuid : string, newCountryName: string) => void;
  onDelete: () => void;
}

function EditToggle({ countryName, lastUpdate, options, onSave, onDelete, editing, setEditing }: EditToggleProps) {
  const selectOptions = useMemo(
    () => toSelectOptions(options, (c) => c.uuid, (c) => c.country_name),
    [options]
  );
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>(countryName);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  const handleEdit = () => {
    setSelected(selectOptions.find((opt) => opt.label === countryName)?.uuid ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(selected , selectOptions.find((opt) => opt.uuid === selected)?.label ?? "");
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
    setSelected(countryName);
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <td>{countryName}</td>
        <td>{new Date(lastUpdate).toLocaleDateString("fr-FR")}</td>
        <td>
          <Loading style={{ width: "100%", height: "100%" }} fullPage={false} spinnerSize={20} />
        </td>
      </>
    );
  }

  if (!editing) {
    return (
      <>
        <td>{countryName}</td>
        <td>{new Date(lastUpdate).toLocaleDateString("fr-FR")}</td>
        <td>
          <button
            className="edit-btn"
            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
            title="Edit"
          >
            Edit
          </button>
        </td>
      </>
    );
  }

  return (
    <>
      <td style={{ position: "relative" }}>
        <SelectSearchable
          value={selected}
          options={selectOptions}
          onChange={(opt) => setSelected(opt.uuid)}
        />
      </td>
      <td>{new Date(lastUpdate).toLocaleDateString("fr-FR")}</td>
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={handleSave} title="Save changes">
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

/* ───────────────────── RfrCountryRow ───────────────────── */

export interface RfrCountryRowProps {
  rfr_country: RfrCountryItem;
  countryOptions: CountryNameResponse[];           // list of available country_name values for the dropdown
  onSave?: (uuid: string, newCountryUuid: string, newCountryName : string) => void;
  onDelete?: (uuid: string) => void;
  onClick?: () => void;
}

export function RfrCountryRow({ rfr_country, countryOptions, onSave, onDelete, onClick }: RfrCountryRowProps) {
  const [editing, setEditing] = useState<boolean>(false);
  return (
    <tr onClick={()=>{
      if(!editing) {
        onClick?.()
      }
    }} style={{ cursor: "pointer" }}>
      <EditToggle
        countryName={rfr_country.rfr_country.country_rfr.country_name}
        editing = {editing}
        setEditing = {setEditing}
        lastUpdate={rfr_country.last_update}
        options={countryOptions}
        onSave={(newUuid , newName) => onSave?.(rfr_country.rfr_country.uuid, newUuid, newName)}
        onDelete={() => onDelete?.(rfr_country.rfr_country.uuid)}
      />
    </tr>
  );
}