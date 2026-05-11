import { useState } from "react";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

interface AccordionFormProps {
  handleSend: () => void;
  loading: boolean;
  title : string
  buttonName : string
  textDialog : string
  titleDialog : string
}

export default function ButtonForm( props : AccordionFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-wrapper">
      <button className="accordion-toggle" onClick={() => setOpen((o) => !o)}>
        <span className={`accordion-arrow ${open ? "open" : ""}`}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{props.title}</span>
      </button>

      {open && (
        <div className="accordion-body">
          <ConfirmDialog
            title={props.titleDialog}
            description={props.textDialog}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={props.handleSend}
          >
            <button className="accordion-send-btn" disabled={props.loading}>
              {props.loading ? <Loading fullPage={false} spinnerSize={20} /> : props.buttonName}
            </button>
          </ConfirmDialog>
        </div>
      )}
    </div>
  );
}
