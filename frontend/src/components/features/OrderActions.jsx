/* Actions used in Orders table. Extracted to keep page code short. */
import ActionButton from "../common/ActionButton";

function OrderActions({ order, onTrack, onAssign, onCancel }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <ActionButton onClick={() => onTrack(order.id)}>Track</ActionButton>
      {order.status === "PENDING" ? (
        <ActionButton variant="secondary" onClick={() => onAssign(order.id)}>Assign</ActionButton>
      ) : (
        <ActionButton disabled>Assigned</ActionButton>
      )}
      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
        <ActionButton variant="danger" onClick={() => onCancel(order.id)}>Cancel</ActionButton>
      )}
    </div>
  );
}
export default OrderActions;
