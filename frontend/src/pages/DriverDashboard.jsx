/* Driver dashboard. Heavy logic is moved to hook and DeliveryCard. */
import Navbar from "../components/Navbar";
import Hero from "../components/common/Hero";
import MetricCard from "../components/common/MetricCard";
import Notice from "../components/common/Notice";
import Tabs from "../components/common/Tabs";
import DeliveryCard from "../components/features/DeliveryCard";
import useNotice from "../hooks/useNotice";
import { useDriverDashboard } from "../hooks/useDriverDashboard";

function DriverDashboard() {
  const { notice, setNotice, showNotice } = useNotice();
  const d = useDriverDashboard(showNotice);
  const list = d.activeTab === "active" ? [d.activeDelivery].filter(Boolean) : d.activeTab === "queue" ? d.queueDeliveries : d.completedDeliveries;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Driver Dashboard" />
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <Hero eyebrow="Driver Portal" title="Driver Dashboard" subtitle="Manage assigned deliveries and update progress." right={<span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 text-sm font-semibold"><span className="w-2 h-2 bg-green-500 rounded-full" />On duty</span>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6"><MetricCard label="Today" value={d.stats.total} /><MetricCard label="Completed" value={d.stats.completed} gradient="from-green-500 to-green-700" /><MetricCard label="Avg Time" value={d.stats.avgTime} gradient="from-orange-500 to-orange-700" /><MetricCard label="Rating" value={d.stats.rating} gradient="from-purple-500 to-purple-700" /></div>
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden"><Tabs tabs={[{ id: "active", label: "Active Delivery" }, { id: "queue", label: `Queue (${d.queueDeliveries.length})` }, { id: "history", label: "History" }]} active={d.activeTab} onChange={d.setActiveTab} /><div className="p-5 space-y-4">{d.loading && <p className="text-slate-500">Loading...</p>}{d.error && <p className="text-red-600">{d.error}</p>}{!d.loading && list.length === 0 && <p className="text-slate-400 text-center py-8">No deliveries found</p>}{list.map((x) => <DeliveryCard key={x.id} delivery={x} expanded={d.expandedId === x.id} history={d.historyMap[x.id]} onToggle={d.toggleExpand} onUpdate={d.updateStatus} />)}</div></div>
      </main>
    </div>
  );
}
export default DriverDashboard;
