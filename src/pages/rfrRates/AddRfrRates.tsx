import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";


export interface FormProps {
  rfr_rate_name: string;
}

interface AccordionFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: React.Dispatch<React.SetStateAction<FormProps>>;
  loading: boolean;
}

export default function AddRfrRatesForm({ handleSend, form, setForm, loading }: AccordionFormProps) {
  const [open, setOpen] = useState(false);

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
        <span>Create a RFR rate</span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="accordion-body">

          {/* First row: firstName + lastName */}
          <div className="accordion-name-row">
            <div className="accordion-field">
              <label className="accordion-label">RFR rate name</label>
              <input
                className="accordion-input"
                type="text"
                value={form.rfr_rate_name}
                onChange={(e) => setForm(() => ({ rfr_rate_name: e.target.value }))}
                placeholder="EURIBOR 3M"
                disabled={loading}
              />
            </div>
          </div>

          {/* Send button */}
          <ConfirmDialog
            title="Add a RFR rate"
            description="This will create a RFR rate, you can still delete it at any time"
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