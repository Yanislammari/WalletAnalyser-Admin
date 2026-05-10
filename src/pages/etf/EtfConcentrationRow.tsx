import { useMemo, useState } from "react";
import Loading from "../../components/Loading";
import type { EtfHoldingsAsset } from "../../payloads/EtfConcentrationPayload";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import type { SectorNameResponse } from "../../payloads/SectorPayload";

interface ModifyConcentrationRowProps {
  value: EtfHoldingsAsset;
  onSave?: (id: string, newSector: string, newCountry: string, newPercentage: number) => void;
  countries : CountryNameResponse[];
  sectors : SectorNameResponse[];
}

export function ModifyConcentrationRow({ value, onSave, countries, sectors}: ModifyConcentrationRowProps) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [editSector, setEditSector] = useState<string>(value.asset.sector?.uuid ?? "");
  const [editCountry, setEditCountry] = useState<string>(value.asset.country?.uuid ?? "");
  const [editPercentage, setEditPercentage] = useState<string>(String(value.asset_percentage_concentration_in_etf));

  const sectorOptions = useMemo(
    () => toSelectOptions(sectors, (s) => s.uuid, (s) => s.sector_name),
    [sectors]
  );

  const countryOptions = useMemo(
    () => toSelectOptions(countries, (c) => c.uuid, (c) => c.country_name),
    [countries]
  );

  const handleEdit = () => {
    console.log(value.asset.sector?.uuid)
    setEditSector(value.asset.sector?.uuid ?? "");
    setEditCountry(value.asset.country?.uuid ?? "");
    setEditPercentage(String(value.asset_percentage_concentration_in_etf));
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    onSave?.(value.asset.uuid, editSector, editCountry, Number(editPercentage));
    setLoading(false);
    setEditing(false);
  };

  const handleExit = () => {
    setEditSector("");
    setEditCountry("");
    setEditPercentage("");
    setEditing(false);
  };

  if (loading) {
    return (
      <tr>
        <td>{value.asset.official_name}</td>
        <td>{value.asset.sector?.sector_name ?? ""}</td>
        <td>{value.asset.country?.country_name ?? ""}</td>
        <td>{value.asset_percentage_concentration_in_etf}%</td>
        <td>
          <Loading style={{ width: "100%", height: "100%" }} fullPage={false} spinnerSize={20} />
        </td>
      </tr>
    );
  }

  if (!editing) {
    return (
      <tr>
        <td>{value.asset.official_name}</td>
        <td>{value.asset.sector?.sector_name ?? ""}</td>
        <td>{value.asset.country?.country_name ?? ""}</td>
        <td>{value.asset_percentage_concentration_in_etf.toFixed(2)}%</td>
        <td>
          <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(); }} title="Edit">
            Edit
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{value.asset.official_name}</td>
      <td>
        <SelectSearchable
          value={ editSector }
          options={ sectorOptions }
          onChange={(uuid) => setEditSector(uuid)}
        />
      </td>
      <td>
        <SelectSearchable
          value={ editCountry }
          options={ countryOptions }
          onChange={(uuid) => setEditCountry(uuid)}
        />
      </td>
      <td>
        <input
          className="edit-input"
          type="number"
          value={editPercentage}
          onChange={(e) => setEditPercentage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleExit();
          }}
          placeholder="Percentage"
        />
      </td>
      <td>
        <div className="edit-actions">
          <button className="action-btn save-btn" onClick={handleSave} title="Save changes">
            Save
          </button>
          {/**<ConfirmDialog
            title="Delete concentration"
            description="This will permanently delete this entry. This action cannot be undone."
            confirmLabel="Yes, delete"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleDelete}
          >
            <button className="action-btn delete-btn" title="Delete">
              Delete
            </button>
          </ConfirmDialog>**/}
          <button className="action-btn exit-btn" onClick={handleExit} title="Cancel editing">
            Exit
          </button>
        </div>
      </td>
    </tr>
  );
}