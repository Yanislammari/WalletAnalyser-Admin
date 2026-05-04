import { useState, type Dispatch, type SetStateAction } from "react";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import Loading from "../../components/Loading";
import { toast } from "sonner";
import ForexService from "../../services/ForexService";

export interface FormProps {
  file: File | null;
}

interface AddForexFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: Dispatch<SetStateAction<FormProps>>;
  loading: boolean;
}

export default function AddForexForm({ handleSend, form, setForm, loading }: AddForexFormProps) {
  const [open, setOpen] = useState(false);

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
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>
                Step 1
              </div>
              <button onClick={handleDownload} className="accordion-get-template">
                Download Excel template
              </button>
            </li>
            <li>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "4px" }}>
                Step 2 — Upload file
              </div>
              <div style={{ marginBottom: "12px" }}>
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
            </li>
          </ol>

          <ConfirmDialog
            title="Upload forex rates"
            description="This will import forex data from the selected Excel file."
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
