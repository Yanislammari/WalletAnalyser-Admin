import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";

export interface FormProps {
  currency_name: string;
}

interface AddCurrencyFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: React.Dispatch<React.SetStateAction<FormProps>>;
  loading: boolean;
}

export default function AddCurrencyForm({ handleSend, form, setForm, loading }: AddCurrencyFormProps) {
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
        <span>Create a currency</span>
      </button>

      {open && (
        <div className="accordion-body">
          <div className="accordion-name-row">
            <div className="accordion-field">
              <label className="accordion-label">Currency name</label>
              <input
                className="accordion-input"
                type="text"
                value={form.currency_name}
                onChange={(e) => setForm(() => ({ currency_name: e.target.value }))}
                placeholder="USD"
                disabled={loading}
              />
            </div>
          </div>

          <ConfirmDialog
            title="Add a currency"
            description="This will create a new currency. You can still delete it at any time."
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
