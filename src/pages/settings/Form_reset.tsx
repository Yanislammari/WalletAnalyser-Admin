import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import "../../style/AccordionForm.css";

export interface FormProps {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface AccordionFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: React.Dispatch<React.SetStateAction<FormProps>>;
  loading: boolean;
}

export default function ChangePassword({ handleSend, form, setForm, loading }: AccordionFormProps) {
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
        <span>Change password</span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="accordion-body">
            {/* Second row: email */}
            <div className="accordion-field">
              <label className="accordion-label">Old password</label>
              <input
                className="accordion-input"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="x1a@#%&"
                disabled={loading}
              />
            </div>
            {/* First row: firstName + lastName */}
            <div className="accordion-name-row">
              <div className="accordion-field">
                <label className="accordion-label">New password</label>
                <input
                  className="accordion-input"
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                  placeholder="new"
                  disabled={loading}
                />
              </div>
              <div className="accordion-field">
                <label className="accordion-label">Confirm new password</label>
                <input
                  className="accordion-input"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="confirm"
                  disabled={loading}
                />
              </div>
            </div>

          {/* Send button */}
          <ConfirmDialog
            title="Add someone"
            description="This will change your password, are you sure ?"
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