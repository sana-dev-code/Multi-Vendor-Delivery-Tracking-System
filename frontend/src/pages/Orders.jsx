/* Orders management page. Extracted actions/table components keep it short. */
import { FiCheckCircle, FiClock, FiShoppingBag, FiXCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import ConfirmModal from "../components/common/ConfirmModal";
import DataTable from "../components/common/DataTable";
import MetricCard from "../components/common/MetricCard";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import OrderActions from "../components/features/OrderActions";
import TrackingPanel from "../components/features/TrackingPanel";
import { useOrders } from "../hooks/useOrders";

function Orders() {
  const o = useOrders();

  return (
    <Layout title="Orders Management">
      <PageHeader title="Orders" subtitle="View and manage all orders across vendors" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <MetricCard label="Total Orders" value={o.counts.total} icon={FiShoppingBag} />
        <MetricCard label="Delivered" value={o.counts.delivered} icon={FiCheckCircle} gradient="from-green-500 to-green-700" />
        <MetricCard label="Pending" value={o.counts.pending} icon={FiClock} gradient="from-yellow-400 to-yellow-600" />
        <MetricCard label="Cancelled" value={o.counts.cancelled} icon={FiXCircle} gradient="from-red-500 to-red-700" />
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-6 flex flex-col md:flex-row md:justify-between gap-4">
        <input className="border border-slate-200 p-3 rounded-xl w-full md:w-96" placeholder="Search by order number or ID..." value={o.search} onChange={(e) => o.setSearch(e.target.value)} />
        <select className="border border-slate-200 p-3 rounded-xl" value={o.statusFilter} onChange={(e) => o.setStatusFilter(e.target.value)}>
          {["ALL", "PENDING", "CONFIRMED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"].map((s) => <option key={s} value={s}>{s === "ALL" ? "All Statuses" : s}</option>)}
        </select>
      </div>
      <DataTable columns={["Order #", "Amount", "Pickup", "Delivery", "Status", "Actions"]} isEmpty={o.filtered.length === 0} emptyText="No orders found">
        {o.filtered.map((order) => <tr key={order.id} className="border-t hover:bg-slate-50"><td className="p-4 font-bold">{order.order_number}</td><td className="p-4">Rs. {Number(order.total_amount || 0).toLocaleString()}</td><td className="p-4 text-sm text-slate-600">{order.pickup_address}</td><td className="p-4 text-sm text-slate-600">{order.delivery_address}</td><td className="p-4"><StatusBadge status={order.status} /></td><td className="p-4"><OrderActions order={order} onTrack={o.trackOrder} onAssign={o.autoAssign} onCancel={o.setCancelId} /></td></tr>)}
      </DataTable>
      <TrackingPanel tracking={o.tracking} title={`Tracking — Order #${o.trackingOrderId}`} onClose={() => o.setTracking(null)} />
      <ConfirmModal open={Boolean(o.cancelId)} title="Cancel Order" message="Are you sure you want to cancel this order?" confirmText="Yes, Cancel" onCancel={() => o.setCancelId(null)} onConfirm={o.cancelOrder} />
    </Layout>
  );
}
export default Orders;
