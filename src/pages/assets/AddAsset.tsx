import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import Loading from "../../components/Loading";
import { AssetType, type AssetPatch } from "../../payloads/AssetPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";

interface AddAssetFormProps {
  handleSend: () => void;
  form: AssetPatch;
  setForm: React.Dispatch<React.SetStateAction<AssetPatch>>;
  loading: boolean;
  currencies : CurrencyNameResponse[];
  countries : CountryNameResponse[];
  sectors : SectorNameResponse[];
  title? : string
  type : AssetType
}

export default function AddAssetForm({ handleSend, form, setForm, loading, currencies, countries, sectors, title=`Add a new stock`, type }: AddAssetFormProps) {
  const [open, setOpen] = useState(false);

  const styleForAllSelect : React.CSSProperties = {
    position : "relative",
    marginTop : "5px",
  }

  const sectorOptions = useMemo(
    () => toSelectOptions(sectors, (s) => s.uuid, (s) => s.sector_name),
    [sectors]
  );

  const countryOptions = useMemo(
    () => toSelectOptions(countries, (c) => c.uuid, (c) => c.country_name),
    [countries]
  );

  const currenciesOptions = useMemo(
    () => toSelectOptions(currencies, (s) => s.uuid, (s) => s.currency_name),
    [currencies]
  );

  return (
    <div className="accordion-wrapper">

      {/* Toggle button */}
      <button className="accordion-toggle" onClick={() => setOpen((o) => !o)}>
        <span className={`accordion-arrow ${open ? "open" : ""}`}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 4L6 8L10 4"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>{title}</span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="accordion-body">

          {/* First row: firstName + lastName */}
          <div className="accordion-name-row">
            <div className="accordion-field">
              <label className="accordion-label">Company name</label>
              <input
                className="accordion-input"
                type="text"
                value={form.official_name}
                onChange={(e) => setForm((f) => ({ ...f, official_name: e.target.value }))}
                placeholder="Microsoft"
                disabled={loading}
              />
            </div>
            <div className="accordion-field">
              <label className="accordion-label">API ticker</label>
              <input
                className="accordion-input"
                type="text"
                value={form.ticker_name }
                onChange={(e) => setForm((f) => ({ ...f, ticker_name: e.target.value }))}
                placeholder="MSFT"
                disabled={loading}
              />
            </div>
          </div>

          { type == AssetType.STOCKS && (
            <div className="accordion-name-row">
              <div className="accordion-field">
                <label className="accordion-label">Sectors</label>
                <div style={styleForAllSelect}>
                  <SelectSearchable
                    value={ form.sector_uuid ?? ""}
                    options={ sectorOptions }
                    onChange={(uuid) => {
                      setForm((f) => ({ ...f, sector_uuid : uuid }))
                    }}
                  />
                </div>
              </div>
              <div className="accordion-field">
                <label className="accordion-label">Country</label>
                <div style={styleForAllSelect}>
                  <SelectSearchable
                    value={ form.country_uuid ?? "" }
                    options={ countryOptions }
                    onChange={(uuid) => {
                      setForm((f) => (
                        { ...f, country_uuid : uuid }
                      ))
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="accordion-name-row">
            <div className="accordion-field">
              <label className="accordion-label">Currencies</label>
              <div style={styleForAllSelect}>
                <SelectSearchable
                  value={ form.base_currency_uuid ?? ""}
                  options={ currenciesOptions }
                  onChange={(uuid) => {
                    setForm((f) => ({ ...f, base_currency_uuid : uuid }))
                  }}
                />
              </div>
            </div>
            <div className="accordion-field">
              <label className="accordion-label">Type of asset</label>
              <input
                className="accordion-input"
                type="text"
                value={ form.type }
                disabled={true}
              />
            </div>
          </div>

          {/* Send button */}
          <div style={{marginTop : "25px"}}>
          <ConfirmDialog
            title={`Add / Modify ${type}`}
            description={`This will create / modify a ${type}, you can stil delete it at any time`}
            confirmLabel= "Confirm"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleSend}
          >
            <button className="accordion-send-btn" disabled={loading}>
              {loading ? <Loading fullPage={false} spinnerSize={20} /> : "Send"}
            </button>
          </ConfirmDialog>
          </div>
        </div>
      )}
    </div>
  );
}