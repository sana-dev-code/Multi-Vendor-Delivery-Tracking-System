/* Vendor dashboard. Logic is in hook and form/actions components. */
import Navbar from "../components/Navbar";
import Hero from "../components/common/Hero";
import MetricCard from "../components/common/MetricCard";
import Notice from "../components/common/Notice";
import StatusBadge from "../components/common/StatusBadge";
import Tabs from "../components/common/Tabs";
import ConfirmModal from "../components/common/ConfirmModal";
import VendorOrderForm from "../components/features/VendorOrderForm";
import TrackingPanel from "../components/features/TrackingPanel";
import useNotice from "../hooks/useNotice";
import { useVendorDashboard } from "../hooks/useVendorDashboard";

function VendorDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { notice, setNotice, showNotice } = useNotice();
  const v = useVendorDashboard(showNotice);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Vendor Dashboard" />
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Hero eyebrow="Vendor Portal" title={user.full_name || "Vendor User"} subtitle="Manage your orders and track deliveries." />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6"><MetricCard label="Total Orders" value={v.counts.total} /><MetricCard label="Pending" value={v.counts.pending} gradient="from-yellow-400 to-yellow-600" /><MetricCard label="In Progress" value={v.counts.active} gradient="from-orange-500 to-orange-700" /><MetricCard label="Delivered" value={v.counts.delivered} gradient="from-green-500 to-green-700" /><MetricCard label="Cancelled" value={v.counts.cancelled} gradient="from-red-500 to-red-700" /></div>
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden"><Tabs tabs={[{ id: "orders", label: "My Orders" }, { id: "create", label: "New Order" }, { id: "track", label: "Track Order" }, { id: "profile", label: "Profile" }]} active={v.activeTab} onChange={v.setActiveTab} /><div className="p-5">{v.activeTab === "create" && <VendorOrderForm form={v.form} setForm={v.setForm} customers={v.customers} onlyAmount={v.onlyAmount} onSubmit={v.createOrder} creating={v.creating} message={v.formMsg} />}{v.activeTab === "track" && <div className="space-y-4"><input className="border p-3 rounded-xl w-full md:w-96" placeholder="Order ID" value={v.trackId} onChange={(e) => v.setTrackId(e.target.value)} /><button onClick={v.trackOrder} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Track</button>{v.trackErr && <p className="text-red-600">{v.trackErr}</p>}<TrackingPanel tracking={v.tracking} title="Tracking Details" /></div>}{v.activeTab === "profile" && <div><h2 className="text-xl font-bold mb-3">Vendor Profile</h2><p>Status: <StatusBadge status={v.vendorProfile?.status} /></p></div>}{v.activeTab === "orders" && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{v.filtered.map((o) => <div key={o.id} className="border rounded-2xl p-4"><div className="flex justify-between"><h3 className="font-bold">{o.order_number}</h3><StatusBadge status={o.status} /></div><p className="text-slate-500 mt-2">Rs. {o.total_amount}</p><button onClick={() => v.setCancelId(o.id)} className="mt-3 text-red-600 font-semibold">Cancel</button></div>)}</div>}</div></div>
        <ConfirmModal open={Boolean(v.cancelId)} title="Cancel Order" message="Are you sure you want to cancel this order?" confirmText="Yes, Cancel" onCancel={() => v.setCancelId(null)} onConfirm={v.cancelOrder} />
      </main>
    </div>
  );
}
export default VendorDashboard;
