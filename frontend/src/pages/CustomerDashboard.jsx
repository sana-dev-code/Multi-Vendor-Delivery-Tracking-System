/* Customer dashboard. Logic is in useCustomerDashboard hook. */
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiShoppingBag, FiXCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Hero from "../components/common/Hero";
import MetricCard from "../components/common/MetricCard";
import TrackingPanel from "../components/features/TrackingPanel";
import { useCustomerDashboard } from "../hooks/useCustomerDashboard";

function CustomerDashboard() {
  const navigate = useNavigate();
  const c = useCustomerDashboard();
  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Customer Dashboard" />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Hero eyebrow="Customer Portal" title={`Welcome back${c.profile?.name ? `, ${c.profile.name}` : ""}`} subtitle="Track your deliveries in real time." right={<button onClick={logout} className="bg-white/10 border border-white/20 px-5 py-3 rounded-xl font-semibold">Logout</button>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <MetricCard label="Total Orders" value={c.counts.total} icon={FiShoppingBag} />
          <MetricCard label="Pending" value={c.counts.pending} icon={FiClock} gradient="from-yellow-400 to-yellow-600" />
          <MetricCard label="Delivered" value={c.counts.delivered} icon={FiCheckCircle} gradient="from-green-500 to-green-700" />
          <MetricCard label="Cancelled" value={c.counts.cancelled} icon={FiXCircle} gradient="from-red-500 to-red-700" />
        </div>
        <div className="bg-white rounded-3xl shadow-sm border p-6 mb-6"><p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Track your order</p><div className="flex flex-col sm:flex-row gap-3"><input className="flex-1 border p-3 rounded-xl" placeholder="Enter order ID" value={c.orderId} onChange={(e) => c.setOrderId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && c.trackOrderById(c.orderId)} /><button onClick={() => c.trackOrderById(c.orderId)} disabled={c.loading} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">{c.loading ? "Tracking..." : "Track"}</button></div>{c.error && <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-xl">{c.error}</div>}</div>
        <TrackingPanel tracking={c.tracking} title="Tracking Details" />
      </main>
    </div>
  );
}
export default CustomerDashboard;
