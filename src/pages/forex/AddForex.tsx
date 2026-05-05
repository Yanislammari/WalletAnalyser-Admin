import { useState, type Dispatch, type SetStateAction } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import Loading from "../../components/Loading";
import { toast } from "sonner";
import ForexService from "../../services/ForexService";
import { SelectSearchable, toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";

export interface FormProps {
  file: File | null;
  base_currency_uuid : string
}

interface AddForexFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: Dispatch<SetStateAction<FormProps>>;
  loading: boolean;
  currencies : CurrencyNameResponse[]
}

export default function AddForexForm({ handleSend, form, setForm, loading, currencies }: AddForexFormProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handleDownload = async () => {
    try {
      const blob = await ForexService.getInstance().getExcelTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "forex-template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleSendInfo = () => {
    toast.info("This can take a very long time")
    setOpen(false)
    handleSend()
  }

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
        <span>Upload forex rates from Excel</span>
      </button>

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
                        href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-red"
                        style={{ fontWeight: 800 }}
                      >
                        ECB Forex Rates ↗
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
                      Step 4 — Select the base currency
                    </div>
                      <td style={{ position: "relative", marginLeft : "-20px", marginTop : "-20px", marginBottom : "-15px" }}>
                        <SelectSearchable
                          value={selected}
                          options={toSelectOptions(currencies, (c) => c.uuid, (c) => c.currency_name)}
                          onChange={(uuid) => {
                            setSelected(uuid)
                            setForm((f) => ({ ...f, base_currency_uuid: uuid }))
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

          <ConfirmDialog
            title="Upload forex rates"
            description="This will import forex data from the selected Excel file."
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={handleSendInfo}
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
