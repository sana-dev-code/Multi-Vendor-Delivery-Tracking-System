import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [report, setReport] = useState({});
  const [vendors, setVendors] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [notice, setNotice] = useState(null);

  const [vendorForm, setVendorForm] = useState({
    full_name: "",
    email: "",
    password: "123456",
    company_name: "",
    phone: "",
    address: "",
  });

  const [driverForm, setDriverForm] = useState({
    full_name: "",
    email: "",
    password: "123456",
    license_number: "",
    vehicle_type: "",
  });

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const loadReports = async () => {
    try {
      const dashboard = await api.get("/reports/dashboard");
      const vendorPerf = await api.get("/reports/vendor-performance");
      const driverPerf = await api.get("/reports/driver-performance");

      setReport(dashboard.data);
      setVendors(vendorPerf.data);
      setDrivers(driverPerf.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      await loadReports();
    };
    fetchReports();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const createVendor = async (e) => {
    e.preventDefault();

    try {
      const userRes = await api.post("/auth/register", {
        full_name: vendorForm.full_name,
        email: vendorForm.email,
        password: vendorForm.password,
        role: "VENDOR",
      });

      await api.post("/admin/vendors", {
        user_id: userRes.data.id,
        company_name: vendorForm.company_name,
        phone: vendorForm.phone,
        address: vendorForm.address,
      });

      showNotice("success", "Vendor created successfully.");

      setVendorForm({
        full_name: "",
        email: "",
        password: "123456",
        company_name: "",
        phone: "",
        address: "",
      });

      await loadReports();
    } catch (err) {
      console.error(err);
      showNotice("error", err.response?.data?.detail || "Failed to create vendor.");
    }
  };

  const createDriver = async (e) => {
    e.preventDefault();

    try {
      const userRes = await api.post("/auth/register", {
        full_name: driverForm.full_name,
        email: driverForm.email,
        password: driverForm.password,
        role: "DRIVER",
      });

      await api.post("/admin/drivers", {
        user_id: userRes.data.id,
        license_number: driverForm.license_number,
        vehicle_type: driverForm.vehicle_type,
      });

      showNotice("success", "Driver created successfully.");

      setDriverForm({
        full_name: "",
        email: "",
        password: "123456",
        license_number: "",
        vehicle_type: "",
      });

      await loadReports();
    } catch (err) {
      console.error(err);
      showNotice("error", err.response?.data?.detail || "Failed to create driver.");
    }
  };

  const cards = [
    ["Total Orders", report.total_orders, "📦", "from-blue-500 to-blue-700"],
    ["Completed Orders", report.completed_orders, "✅", "from-green-500 to-green-700"],
    ["Active Deliveries", report.active_deliveries, "🚚", "from-orange-500 to-orange-700"],
    ["Completed Deliveries", report.completed_deliveries, "📍", "from-purple-500 to-purple-700"],
    ["Vendors", report.total_vendors, "🏪", "from-indigo-500 to-indigo-700"],
    ["Drivers", report.total_drivers, "🧑‍✈️", "from-cyan-500 to-cyan-700"],
    ["Customers", report.total_customers, "👥", "from-pink-500 to-pink-700"],
    ["Cancelled Orders", report.cancelled_orders, "❌", "from-red-500 to-red-700"],
  ];

  return (
    <Layout title="Admin Dashboard">
      {notice && (
        <div
          className={`fixed top-6 right-6 z-[999] rounded-2xl shadow-xl px-6 py-4 border ${
            notice.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{notice.type === "success" ? "✅" : "⚠️"}</span>
            <p className="font-semibold">{notice.text}</p>
            <button onClick={() => setNotice(null)} className="ml-3 font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-8 shadow-xl mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Multi-Vendor Delivery Platform</h1>
            <p className="text-blue-100 mt-2">
              Manage vendors, drivers, assignments, delivery lifecycle and analytics.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {cards.map(([label, value, icon, color]) => (
          <div key={label} className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${color}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">{label}</p>
                <h2 className="text-4xl font-bold mt-2">{value ?? 0}</h2>
              </div>
              <div className="text-5xl">{icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <form onSubmit={createVendor} className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">➕ Create Vendor</h2>

          {["full_name", "email", "company_name", "phone", "address"].map((field) => (
            <input
              key={field}
              className="w-full border p-3 rounded-lg mb-3"
              placeholder={field.replace("_", " ").toUpperCase()}
              value={vendorForm[field]}
              onChange={(e) => setVendorForm({ ...vendorForm, [field]: e.target.value })}
            />
          ))}

          <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold">
            Create Vendor
          </button>
        </form>

        <form onSubmit={createDriver} className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🚚 Create Driver</h2>

          {["full_name", "email", "license_number", "vehicle_type"].map((field) => (
            <input
              key={field}
              className="w-full border p-3 rounded-lg mb-3"
              placeholder={field.replace("_", " ").toUpperCase()}
              value={driverForm[field]}
              onChange={(e) => setDriverForm({ ...driverForm, [field]: e.target.value })}
            />
          ))}

          <button className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold">
            Create Driver
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🏪 Vendor Performance</h2>
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Orders</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.vendor_id} className="border-t">
                  <td className="p-3">{vendor.company_name}</td>
                  <td className="p-3 font-bold">{vendor.total_orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🚚 Driver Performance</h2>
          <table className="w-full">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Driver ID</th>
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Deliveries</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.driver_id} className="border-t">
                  <td className="p-3">{driver.driver_id}</td>
                  <td className="p-3">{driver.vehicle_type}</td>
                  <td className="p-3 font-bold">{driver.total_deliveries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;