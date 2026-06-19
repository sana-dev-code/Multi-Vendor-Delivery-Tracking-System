/* Admin dashboard page. Logic is moved into useAdminDashboard hook. */
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiCheckCircle, FiLogOut, FiMapPin, FiShoppingBag, FiTruck, FiUserCheck, FiUsers, FiXCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import Hero from "../components/common/Hero";
import MetricCard from "../components/common/MetricCard";
import Notice from "../components/common/Notice";
import AdminAccountForm from "../components/features/AdminAccountForm";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import useNotice from "../hooks/useNotice";

function AdminDashboard() {
  const navigate = useNavigate();
  const { notice, setNotice, showNotice } = useNotice(3500);
  const data = useAdminDashboard(showNotice);

  const cards = [
    ["Total Orders", data.report.total_orders, FiShoppingBag, "from-blue-500 to-blue-700"],
    ["Completed Orders", data.report.completed_orders, FiCheckCircle, "from-green-500 to-green-700"],
    ["Active Deliveries", data.report.active_deliveries, FiTruck, "from-orange-500 to-orange-700"],
    ["Completed Deliveries", data.report.completed_deliveries, FiMapPin, "from-purple-500 to-purple-700"],
    ["Vendors", data.report.total_vendors, FiBriefcase, "from-indigo-500 to-indigo-700"],
    ["Drivers", data.report.total_drivers, FiUserCheck, "from-cyan-500 to-cyan-700"],
    ["Customers", data.report.total_customers, FiUsers, "from-pink-500 to-pink-700"],
    ["Cancelled Orders", data.report.cancelled_orders, FiXCircle, "from-red-500 to-red-700"],
  ];

  return (
    <Layout title="Admin Dashboard">
      <Notice notice={notice} onClose={() => setNotice(null)} />
      <Hero eyebrow="Admin Control Center" title="Multi-Vendor Delivery Platform" subtitle="Manage vendors, drivers, assignments and analytics." right={<button onClick={() => { localStorage.clear(); navigate("/"); }} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl font-semibold"><FiLogOut />Logout</button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">{cards.map(([label, value, Icon, gradient]) => <MetricCard key={label} label={label} value={value} icon={Icon} gradient={gradient} />)}</div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <AdminAccountForm type="vendor" form={data.vendorForm} setForm={data.setVendorForm} onSubmit={data.createVendor} onlyName={data.onlyName} onlyDigits={data.onlyDigits} onlyLicense={data.onlyLicense} />
        <AdminAccountForm type="driver" form={data.driverForm} setForm={data.setDriverForm} onSubmit={data.createDriver} onlyName={data.onlyName} onlyDigits={data.onlyDigits} onlyLicense={data.onlyLicense} />
      </div>
    </Layout>
  );
}
export default AdminDashboard;
