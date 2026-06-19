/* Driver management page. */
import { FiCheckCircle, FiDatabase, FiTruck, FiXCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import ActionButton from "../components/common/ActionButton";
import ConfirmModal from "../components/common/ConfirmModal";
import DataTable from "../components/common/DataTable";
import MetricCard from "../components/common/MetricCard";
import Notice from "../components/common/Notice";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { useDrivers } from "../hooks/useDrivers";
import useNotice from "../hooks/useNotice";

function Drivers() {
  const { notice, setNotice, showNotice } = useNotice();
  const d = useDrivers(showNotice);

  return (
    <Layout title="Driver Management">
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <PageHeader title="Drivers" subtitle="Manage all drivers from one place" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <MetricCard label="Total Drivers" value={d.counts.total} icon={FiTruck} gradient="from-cyan-500 to-cyan-700" />
        <MetricCard label="Active Drivers" value={d.counts.active} icon={FiCheckCircle} gradient="from-green-500 to-green-700" />
        <MetricCard label="Suspended" value={d.counts.suspended} icon={FiXCircle} gradient="from-red-500 to-red-700" />
        <MetricCard label="Total Records" value={d.counts.total} icon={FiDatabase} gradient="from-purple-500 to-purple-700" />
      </div>
      <div className="bg-white rounded-3xl shadow-sm border p-5 mb-6"><input className="border p-3 rounded-xl w-full md:w-96" placeholder="Search by license or vehicle..." value={d.search} onChange={(e) => d.setSearch(e.target.value)} /></div>
      <DataTable columns={["Driver ID", "License", "Vehicle", "Status", "Actions"]} isEmpty={d.filtered.length === 0}>
        {d.filtered.map((driver) => <tr key={driver.id} className="border-t hover:bg-slate-50"><td className="p-4 font-semibold">{driver.id}</td><td className="p-4">{driver.license_number}</td><td className="p-4">{driver.vehicle_type}</td><td className="p-4"><StatusBadge status={driver.status || driver.current_status} /></td><td className="p-4"><div className="flex flex-wrap gap-2"><ActionButton onClick={() => d.viewDriver(driver.id)}>View</ActionButton><ActionButton variant="secondary" onClick={() => d.setEditDriverData(driver)}>Edit</ActionButton><ActionButton variant="danger" onClick={() => d.setSuspendId(driver.id)}>Suspend</ActionButton></div></td></tr>)}
      </DataTable>
      <ConfirmModal open={Boolean(d.suspendId)} title="Suspend Driver" message="Are you sure you want to suspend this driver?" confirmText="Suspend" onCancel={() => d.setSuspendId(null)} onConfirm={d.suspendDriver} />
    </Layout>
  );
}
export default Drivers;
