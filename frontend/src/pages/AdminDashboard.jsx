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
    password: "",
    company_name: "",
    phone: "",
    address: "",
  });

  const [driverForm, setDriverForm] = useState({
    full_name: "",
    email: "",
    password: "",
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

  const strongPasswordRegex = /^(?=.{10,}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-]).*$/;
  const phoneRegex = /^03\d{9}$/;
  const licenseRegex = /^[A-Za-z0-9-]{4,20}$/;
  const nameRegex = /^[A-Za-z ]{3,50}$/;

  const onlyDigits = (value, maxLength = 11) => value.replace(/\D/g, "").slice(0, maxLength);
  const onlyName = (value) => value.replace(/[^A-Za-z ]/g, "").slice(0, 50);
  const onlyLicense = (value) => value.replace(/[^A-Za-z0-9-]/g, "").slice(0, 20).toUpperCase();

  const createVendor = async (e) => {
    e.preventDefault();

    if (!nameRegex.test(vendorForm.full_name.trim())) {
      showNotice("error", "Vendor full name should contain only alphabets and spaces, minimum 3 characters.");
      return;
    }

    if (!phoneRegex.test(vendorForm.phone)) {
      showNotice("error", "Vendor phone number must be exactly 11 digits and start with 03, e.g. 03001234567.");
      return;
    }

    if (!strongPasswordRegex.test(vendorForm.password)) {
      showNotice(
        "error",
        "Vendor password must be 10+ chars, no spaces, uppercase, lowercase, number and special character (@$!%*?&#_-)."
      );
      return;
    }

    try {
      await api.post("/admin/vendors", {
        full_name: vendorForm.full_name,
        email: vendorForm.email,
        password: vendorForm.password,
        company_name: vendorForm.company_name,
        phone: vendorForm.phone,
        address: vendorForm.address,
      });

      showNotice("success", "Vendor account created successfully.");

      setVendorForm({
        full_name: "",
        email: "",
        password: "",
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

    if (!nameRegex.test(driverForm.full_name.trim())) {
      showNotice("error", "Driver full name should contain only alphabets and spaces, minimum 3 characters.");
      return;
    }

    if (!licenseRegex.test(driverForm.license_number)) {
      showNotice("error", "License number must be 4-20 characters and only letters, numbers or hyphen.");
      return;
    }

    if (!driverForm.vehicle_type.trim()) {
      showNotice("error", "Vehicle type is required.");
      return;
    }

    if (!strongPasswordRegex.test(driverForm.password)) {
      showNotice(
        "error",
        "Driver password must be 10+ chars, no spaces, uppercase, lowercase, number and special character (@$!%*?&#_-)."
      );
      return;
    }

    try {
      await api.post("/admin/drivers", {
        full_name: driverForm.full_name,
        email: driverForm.email,
        password: driverForm.password,
        license_number: driverForm.license_number,
        vehicle_type: driverForm.vehicle_type,
      });

      showNotice("success", "Driver account created successfully.");

      setDriverForm({
        full_name: "",
        email: "",
        password: "",
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

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="FULL NAME"
            value={vendorForm.full_name}
            onChange={(e) => setVendorForm({ ...vendorForm, full_name: onlyName(e.target.value) })}
            minLength={3}
            maxLength={50}
            required
          />

          <input
            type="email"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="EMAIL"
            value={vendorForm.email}
            onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value.trim() })}
            required
          />

          <input
            type="password"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="STRONG PASSWORD e.g. Sana@12345"
            value={vendorForm.password}
            onChange={(e) => setVendorForm({ ...vendorForm, password: e.target.value })}
            minLength={10}
            required
          />

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="COMPANY NAME"
            value={vendorForm.company_name}
            onChange={(e) => setVendorForm({ ...vendorForm, company_name: e.target.value.slice(0, 80) })}
            maxLength={80}
            required
          />

          <input
            type="tel"
            inputMode="numeric"
            pattern="03[0-9]{9}"
            maxLength={11}
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="PHONE e.g. 03001234567"
            value={vendorForm.phone}
            onChange={(e) => setVendorForm({ ...vendorForm, phone: onlyDigits(e.target.value, 11) })}
            required
          />

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="ADDRESS"
            value={vendorForm.address}
            onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value.slice(0, 150) })}
            maxLength={150}
            required
          />
          <p className="text-xs text-slate-500 mb-3">
            Password must contain uppercase, lowercase, number, special character and minimum 10 characters.
          </p>

          <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold">
            Create Vendor
          </button>
        </form>

        <form onSubmit={createDriver} className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🚚 Create Driver</h2>

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="FULL NAME"
            value={driverForm.full_name}
            onChange={(e) => setDriverForm({ ...driverForm, full_name: onlyName(e.target.value) })}
            minLength={3}
            maxLength={50}
            required
          />

          <input
            type="email"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="EMAIL"
            value={driverForm.email}
            onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value.trim() })}
            required
          />

          <input
            type="password"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="STRONG PASSWORD e.g. Sana@12345"
            value={driverForm.password}
            onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })}
            minLength={10}
            required
          />

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="LICENSE NUMBER e.g. LEA-12345"
            value={driverForm.license_number}
            onChange={(e) => setDriverForm({ ...driverForm, license_number: onlyLicense(e.target.value) })}
            minLength={4}
            maxLength={20}
            required
          />

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-3"
            placeholder="VEHICLE TYPE e.g. Bike"
            value={driverForm.vehicle_type}
            onChange={(e) => setDriverForm({ ...driverForm, vehicle_type: e.target.value.slice(0, 40) })}
            maxLength={40}
            required
          />
          <p className="text-xs text-slate-500 mb-3">
            Password must contain uppercase, lowercase, number, special character and minimum 10 characters.
          </p>

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