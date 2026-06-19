/* Shared tracking result panel. */
function TrackingPanel({ tracking, title, onClose }) {
  if (!tracking) return null;
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {onClose && <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold">×</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4"><p className="text-sm text-slate-500">Order Number</p><p className="font-bold text-lg">{tracking.order_number}</p></div>
        <div className="bg-slate-50 rounded-xl p-4"><p className="text-sm text-slate-500">Order Status</p><p className="font-bold text-lg">{tracking.order_status}</p></div>
        <div className="bg-slate-50 rounded-xl p-4"><p className="text-sm text-slate-500">Delivery Status</p><p className="font-bold text-lg">{tracking.delivery_status ?? "Not assigned"}</p></div>
      </div>
    </div>
  );
}
export default TrackingPanel;
