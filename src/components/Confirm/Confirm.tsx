import { useState } from "react";
import "./Confirm.css"

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  children: React.ReactNode; // the trigger button
}

type AlertState = { type: "success" | "error"; message: string } | null;

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setAlert({ type: "success", message: "Done!" });
      setTimeout(() => { setOpen(false); setAlert(null); }, 1800);
    } catch {
      setAlert({ type: "error", message: "Something went wrong." });
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
    setAlert(null);
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      {open && (
        <div className="dialog-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
          <div className="dialog-box" role="dialog" aria-modal="true">

            <div className="dialog-header">
              <div className="dialog-icon-wrap" data-variant={variant}>
                <span className="dialog-icon">!</span>
              </div>
              <span className="dialog-title">{title}</span>
              <button className="dialog-close" onClick={handleCancel} aria-label="Close">✕</button>
            </div>

            <p className="dialog-description">{description}</p>

            {alert && (
              <div className={`dialog-alert dialog-alert--${alert.type}`}>
                {alert.message}
              </div>
            )}

            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>{cancelLabel}</button>
              <button className={`btn btn-${variant}`} onClick={handleConfirm}>{confirmLabel}</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};