import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

export interface FormProps {
  forex_rate_date: Date | null;
  forex_rate: number | null;
}

interface AccordionFormProps {
  handleSend: () => void;
  form: FormProps;
  setForm: React.Dispatch<React.SetStateAction<FormProps>>;
  loading: boolean;
}

export default function AddForexRatesForm({ handleSend, form, setForm, loading }: AccordionFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-wrapper">
      <button className="accordion-toggle" onClick={() => setOpen((o) => !o)}>
        <span className={`accordion-arrow ${open ? "open" : ""}`}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>Create a forex rate</span>
      </button>

      {open && (
        <div className="accordion-body">
          <div className="accordion-name-row">
            <div className="accordion-field">
              <label className="accordion-label">Forex date</label>
              <DatePicker
                wrapperClassName="accordion-datepicker-wrapper"
                className="accordion-input"
                selected={form.forex_rate_date}
                onChange={(date: Date | null) => setForm((f) => ({ ...f, forex_rate_date: date }))}
                onChangeRaw={(e) => {
                  if (!e || e.type !== "change") return;
                  const input = e.target as HTMLInputElement;
                  const prev = input.getAttribute("data-prev") ?? "";
                  let val = input.value.replace(/[^\d/]/g, "");
                  const isDeleting = val.length < prev.length;
                  if (!isDeleting) {
                    if (val.length === 2 && !val.includes("/")) val += "/";
                    if (val.length === 5 && val.split("/").length - 1 === 1) val += "/";
                  }
                  input.setAttribute("data-prev", val);
                  input.value = val;
                }}
                locale="fr"
                placeholderText="jj/mm/aaaa"
                dateFormat="dd/MM/yyyy"
                disabled={loading}
                showIcon
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
                isClearable
                autoComplete="off"
              />
            </div>

            <div className="accordion-field">
              <label className="accordion-label">Forex rate</label>
              <input
                className="accordion-input"
                type="number"
                value={form.forex_rate ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, forex_rate: Number(e.target.value) }))}
                placeholder="1.234"
                disabled={loading}
              />
            </div>
          </div>

          <ConfirmDialog
            title="Add a forex rate"
            description="This will create a forex rate, you can still delete it at any time"
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
