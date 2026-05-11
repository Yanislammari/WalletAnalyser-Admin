import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import "../../style/AccordionForm.css";

export interface FormProps {
  firstName: string;
  lastName: string;
  email: string;
}

interface AccordionFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: React.Dispatch<React.SetStateAction<FormProps>>;
  loading: boolean;
}

export default function AccordionForm({ handleSend, form, setForm, loading }: AccordionFormProps) {
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
        <span>Invite a user</span>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="accordion-body">

          {/* First row: firstName + lastName */}
          <div className="accordion-name-row">
            <div className="accordion-field">
              <label className="accordion-label">First name</label>
              <input
                className="accordion-input"
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="Sophie"
                disabled={loading}
              />
            </div>
            <div className="accordion-field">
              <label className="accordion-label">Last name</label>
              <input
                className="accordion-input"
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Martin"
                disabled={loading}
              />
            </div>
          </div>

          {/* Second row: email */}
          <div className="accordion-field">
            <label className="accordion-label">Email</label>
            <input
              className="accordion-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="sophie@example.com"
              disabled={loading}
            />
          </div>

          {/* Send button */}
          <ConfirmDialog
            title="Add someone"
            description="This will create a user that get free access to the application, you can stil ban him at any time"
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