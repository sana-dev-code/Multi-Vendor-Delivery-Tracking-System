/* Vendor management page. Logic is in useVendors hook. */
import { FiBriefcase, FiCheckCircle, FiDatabase, FiXCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import ActionButton from "../components/common/ActionButton";
import DataTable from "../components/common/DataTable";
import MetricCard from "../components/common/MetricCard";
import Notice from "../components/common/Notice";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { useVendors } from "../hooks/useVendors";
import useNotice from "../hooks/useNotice";

function Vendors() {
  const { notice, setNotice, showNotice } = useNotice();
  const v = useVendors(showNotice);

  return (
    <Layout title="Vendor Management">
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <PageHeader title="Vendors" subtitle="Manage all vendors from one place" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <MetricCard label="Total Vendors" value={v.counts.total} icon={FiBriefcase} />
        <MetricCard label="Active Vendors" value={v.counts.active} icon={FiCheckCircle} gradient="from-green-500 to-green-700" />
        <MetricCard label="Inactive Vendors" value={v.counts.inactive} icon={FiXCircle} gradient="from-red-500 to-red-700" />
        <MetricCard label="Total Records" value={v.counts.total} icon={FiDatabase} gradient="from-purple-500 to-purple-700" />
      </div>
      <div className="bg-white rounded-3xl shadow-sm border p-5 mb-6"><input className="border p-3 rounded-xl w-full md:w-96" placeholder="Search Vendor..." value={v.search} onChange={(e) => v.setSearch(e.target.value)} /></div>
      <DataTable columns={["Company", "Phone", "Address", "Status", "Actions"]} isEmpty={v.filtered.length === 0}>
        {v.filtered.map((vendor) => <tr key={vendor.id} className="border-t hover:bg-slate-50"><td className="p-4 font-semibold">{vendor.company_name}</td><td className="p-4">{vendor.phone}</td><td className="p-4">{vendor.address}</td><td className="p-4"><StatusBadge status={vendor.status} /></td><td className="p-4"><div className="flex flex-wrap gap-2"><ActionButton onClick={() => v.viewVendor(vendor.id)}>View</ActionButton><ActionButton variant="secondary" onClick={() => v.editVendor(vendor)}>Edit</ActionButton><ActionButton variant="danger" onClick={() => v.deleteVendor(vendor.id)}>Delete</ActionButton></div></td></tr>)}
      </DataTable>
    </Layout>
  );
}
export default Vendors;
