/* Reusable confirmation modal for cancel, delete, suspend actions. */
import ActionButton from "./ActionButton";

function ConfirmModal({ open, title, message, confirmText = "Confirm", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-3xl shadow-xl p-7 w-full max-w-[420px]">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <ActionButton variant="neutral" onClick={onCancel}>No</ActionButton>
          <ActionButton variant="danger" onClick={onConfirm}>{confirmText}</ActionButton>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;
