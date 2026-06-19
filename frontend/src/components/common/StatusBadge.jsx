/* Central status badge used everywhere. */
const styles = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  AVAILABLE: "bg-green-100 text-green-700 border-green-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  ASSIGNED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  PICKED_UP: "bg-purple-100 text-purple-700 border-purple-200",
  IN_TRANSIT: "bg-orange-100 text-orange-700 border-orange-200",
  BUSY: "bg-orange-100 text-orange-700 border-orange-200",
  SUSPENDED: "bg-red-100 text-red-700 border-red-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

function StatusBadge({ status }) {
  const cls = styles[status] || "bg-slate-100 text-slate-700 border-slate-200";
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status || "UNKNOWN"}</span>;
}
export default StatusBadge;
