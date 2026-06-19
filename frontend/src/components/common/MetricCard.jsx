/* Reusable responsive KPI card. */
function MetricCard({ label, value, icon: Icon, gradient = "from-blue-500 to-blue-700" }) {
  return (
    <div className={`rounded-3xl p-5 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <h2 className="text-3xl lg:text-4xl font-bold mt-2">{value ?? 0}</h2>
        </div>
        {Icon && <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"><Icon className="text-2xl" /></div>}
      </div>
    </div>
  );
}
export default MetricCard;
