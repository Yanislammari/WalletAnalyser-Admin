import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import type { EtfPatchEtfHoldingPayload } from "../../payloads/EtfConcentrationPayload";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import { AssetType } from "../../payloads/AssetPayload";
import AssetsService from "../../services/AssetsService";

interface AddEtfHoldingFormProps {
  handleSend: () => void;
  form: EtfPatchEtfHoldingPayload;
  setForm: React.Dispatch<React.SetStateAction<EtfPatchEtfHoldingPayload>>;
  loading: boolean;
}

export default function AddEtfHolding({ handleSend, form, setForm, loading }: AddEtfHoldingFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-wrapper">
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
        <span>Add an etf holding</span>
      </button>

      {open && (
        <div className="accordion-body">
            <div className="accordion-field">
              <label className="accordion-label">Asset name</label>
              <SelectSearchable value={form.asset_name} options={[]} 
                onChange={(opt) => {
                  setForm((f) => ({ ...f, asset_uuid : opt.uuid, asset_name : opt.label}))
                }}
                loadMore={async (search, offset) => {
                  const res = await AssetsService.getInstance().getAssets(AssetType.STOCKS,search, 100, offset)
                  return toSelectOptions(res.assets , (s)=>s.asset.uuid, (s)=>s.asset.official_name)
                }}
              />
            </div>
            <div>
              <label className="accordion-label">Percentage in Etf</label>
              <input
                style={{marginBottom : "15px"}}
                className="edit-input"
                type="number"
                value={form.asset_percentage_concentration_in_etf}
                onChange={(e) => setForm((f) => {
                  return {
                    ...f,
                    asset_percentage_concentration_in_etf : e.target.value
                  }
                })}
                placeholder="Percentage"
              />
          </div>


          <ConfirmDialog
            title="Add a holding to the etf"
            description="This will create a new holding. You can still delete it at any time."
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleSend}
          >
            <button className="accordion-send-btn" disabled={loading}>
              {loading ? <Loading fullPage={false} spinnerSize={20} /> : "Send"}
            </button>
          </ConfirmDialog>
        </div>
      )}
    </div>
  );
}
