/* Generic metric grid used in management pages. */
import MetricCard from "../common/MetricCard";

function ManagementCards({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {items.map((x) => <MetricCard key={x.label} {...x} />)}
    </div>
  );
}
export default ManagementCards;
