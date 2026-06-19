/* Backward compatible KPI card. */
import MetricCard from "./common/MetricCard";
function StatsCard({ title, value, icon, color }) {
  return <MetricCard label={title} value={value} gradient={color} icon={() => icon} />;
}
export default StatsCard;
