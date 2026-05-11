import { useState } from "react";
import Loading from '../../components/Loading';
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import { toast } from "sonner";
import RfrCountryService from "../../services/RfrCountryService";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import type { CountryNameResponse } from "../../payloads/CountryPayload";


export interface FormProps {
  country_uuid : string;
  file: File | null;
}

interface RfrCountryFormProps {
  handleSend: () => void;
  countries : CountryNameResponse[]
  form: FormProps;
  setForm: React.Dispatch<React.SetStateAction<FormProps>>;
  loading: boolean;
}

export default function AddCountryAlliasForm({ handleSend, countries, form, setForm, loading }: RfrCountryFormProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

  const handleDownload = async () => {
    try {
      const blob = await RfrCountryService.getInstance().getExcelTemplate();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template.xlsx";
      a.click();

      URL.revokeObjectURL(url);
    }
    catch (e: any) {
      toast.error(e.message);
    }
  };

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
        <span>Add a rfr to a country</span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="accordion-body">
          <ol style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "15px", marginTop: "-15px" }}>
            <li>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>Step 1</div>
              <button onClick={handleDownload} className="accordion-get-template">
                Download excel template
              </button>
            </li>
            <li>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>Step 2 — Get the data</div>
              <a
                href="https://fred.stlouisfed.org/series/DGS10"
                target="_blank"
                rel="noopener noreferrer"
                className="link-red"
                style={{ fontWeight: 800 }}
              >
                10-Year Treasury Yield (DGS10) ↗
              </a>
            </li>
            <li>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>Step 3 — Format</div>
              <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                Split the column and replace <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: "4px", fontFamily: "monospace" }}>.</code> with <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: "4px", fontFamily: "monospace" }}>,</code> in decimal values
              </div>
            </li>
          </ol>
          {/* First row: firstName + lastName */}
          <div className="accordion-name-row" style={{flexDirection : "column"}}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af"}}>
              Step 4 — Select a country
            </div>
              <td style={{ position: "relative", marginLeft : "-20px", marginTop : "-20px", marginBottom : "-15px" }}>
                <SelectSearchable
                  value={selected}
                  options={toSelectOptions(countries, (c) => c.uuid, (c) => c.country_name)}
                  onChange={(opt) => {
                    setSelected(opt.uuid)
                    setForm((f) => ({ ...f, country_uuid: opt.uuid }))
                  }}
                />
              </td>
          </div>

        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "6px" }}>
            Step 5 — Upload your file
          </div>
          <label className="accordion-file-label">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm((prev) => ({ ...prev, file }));
              }}
            />
            <span>📎 {form.file ? form.file.name : "Choose a file..."}</span>
          </label>
        </div>

          {/* Send button */}
          <ConfirmDialog
            title="Add a country"
            description="This will create a new rfr, you can stil delete it at any time"
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
      )}
    </div>
  );
}