/* Driver delivery card. */
import StatusBadge from "../common/StatusBadge";
import ActionButton from "../common/ActionButton";
import Timeline from "../common/Timeline";

const steps = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

function DeliveryCard({ delivery, expanded, history, onToggle, onUpdate }) {
  const idx = steps.indexOf(delivery.status);
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div><h3 className="text-xl font-bold">Order #{delivery.order_id}</h3><p className="text-slate-500">{delivery.pickup_address} to {delivery.delivery_address}</p></div>
        <StatusBadge status={delivery.status} />
      </div>
      <Timeline steps={steps} activeIndex={idx} />
      <div className="flex flex-wrap gap-2">
        {delivery.status === "ASSIGNED" && <ActionButton onClick={() => onUpdate(delivery.id, "PICKED_UP")}>Picked Up</ActionButton>}
        {delivery.status === "PICKED_UP" && <ActionButton onClick={() => onUpdate(delivery.id, "IN_TRANSIT")}>In Transit</ActionButton>}
        {delivery.status === "IN_TRANSIT" && <ActionButton variant="success" onClick={() => onUpdate(delivery.id, "DELIVERED")}>Delivered</ActionButton>}
        <ActionButton variant="neutral" onClick={() => onToggle(delivery.id)}>{expanded ? "Hide History" : "View History"}</ActionButton>
      </div>
      {expanded && <div className="mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-600">{history?.length ? history.map((h, i) => <p key={i}>{h.status || h.current_status}</p>) : "No history available"}</div>}
    </div>
  );
}
export default DeliveryCard;
