import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import Loading from "../../components/Loading";
import type { ForexMetaData } from "../../payloads/ForexPayload";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";

interface EditToggleProps {
  value: ForexMetaData;
  onSave: (baseCurrency: string, quoteCurrency: string) => void;
  onDelete: () => void;
  options: CurrencyNameResponse[];
  editing : boolean
  setEditing : React.Dispatch<React.SetStateAction<boolean>>;
}

function EditToggle({ value, onSave, onDelete, options, editing, setEditing }: EditToggleProps) {
  const selectOptions = useMemo(
    () => toSelectOptions(options, (c) => c.uuid, (c) => c.currency_name),
    [options]
  );

  const [loading, setLoading] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState(value.forex.baseCurrency?.uuid ?? "");
  const [quoteCurrency, setQuoteCurrency] = useState(value.forex.quoteCurrency?.uuid ?? "");


  useEffect(() => {
    if (!editing) {
      setBaseCurrency(value.forex.baseCurrency.uuid);
      setQuoteCurrency(value.forex.quoteCurrency.uuid);
    }
  }, [editing]);

  const handleSave = async () => {
    setLoading(true);
    await onSave(baseCurrency, quoteCurrency);
    setLoading(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDelete();
    setLoading(false);
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <td>{value.forex.baseCurrency.currency_name}</td>
        <td>{value.forex.quoteCurrency.currency_name}</td>
        <td>
          {value.last_update
            ? new Date(value.last_update).toLocaleDateString("fr-FR")
            : "No date"}
        </td>
        <td>
          <Loading style={{ width: "100%", height: "100%" }} fullPage={false} spinnerSize={20} />
        </td>
      </>
    );
  }

  if (!editing) {
    return (
      <>
        <td>{value.forex.baseCurrency?.currency_name ?? ""}</td>
        <td>{value.forex.quoteCurrency?.currency_name ?? ""}</td>
        <td>
          {value.last_update
            ? new Date(value.last_update).toLocaleDateString("fr-FR")
            : "No date"}
        </td>
        <td>
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
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
          value={baseCurrency}
          options={selectOptions}
          onChange={(opt) => setBaseCurrency(opt.uuid)}
        />
      </td>
      <td style={{ position: "relative" }}>
        <SelectSearchable
          value={quoteCurrency}
          options={selectOptions}
          onChange={(opt) => setQuoteCurrency(opt.uuid)}
        />
      </td>
      <td>
        {value.last_update
          ? new Date(value.last_update).toLocaleDateString("fr-FR")
          : "No date"}
      </td>
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={handleSave} title="Save changes">
            Save
          </button>
          <ConfirmDialog
            title="Delete forex entry"
            description="This will permanently delete this forex item."
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleDelete}
          >
            <button className="action-btn delete-btn" title="Delete">
              Delete
            </button>
          </ConfirmDialog>
          <button className="action-btn exit-btn" onClick={() => setEditing(false)} title="Cancel editing">
            Exit
          </button>
        </div>
      </td>
    </>
  );
}

export interface ForexRowProps {
  forexItem: ForexMetaData;
  onSave?: (uuid: string, baseCurrency : string, quoteCurrency : string) => void;
  onDelete?: (uuid: string) => void;
  options : CurrencyNameResponse[];
  onClick?: () => void;
}

export function ForexRow({ forexItem, onSave, onDelete, options, onClick }: ForexRowProps) {
  const [editing, setEditing] = useState(false)
  return (
    <tr onClick={() => {
      if(!editing){
        onClick?.()
      }
    }} style={{ cursor: onClick ? "pointer" : "default" }}>
      <EditToggle
        value={forexItem}
        onSave={(baseCurrency, quoteCurrency) => onSave?.(forexItem.forex.uuid, baseCurrency, quoteCurrency)}
        onDelete={() => onDelete?.(forexItem.forex.uuid)}
        options={options}
        editing={editing}
        setEditing={setEditing}
      />
    </tr>
  );
}
