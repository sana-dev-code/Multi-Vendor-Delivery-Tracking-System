import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Reports() {
  const [dashboard, setDashboard] = useState({});
  const [vendorPerf, setVendorPerf] = useState([]);
  const [driverPerf, setDriverPerf] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, vendors, drivers] = await Promise.all([
          api.get("/reports/dashboard"),
          api.get("/reports/vendor-performance"),
          api.get("/reports/driver-performance"),
        ]);
        setDashboard(dash.data);
        setVendorPerf(vendors.data);
        setDriverPerf(drivers.data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  const orderStatusData = [
    { name: "Delivered", value: dashboard.completed_orders ?? 0 },
    { name: "Active", value: dashboard.active_deliveries ?? 0 },
    { name: "Cancelled", value: dashboard.cancelled_orders ?? 0 },
  ];

  const PIE_COLORS = ["#10b981", "#3b82f6", "#ef4444"];

  const vendorChartData = vendorPerf.map((v) => ({
    name: v.company_name,
    orders: v.total_orders,
  }));

  const driverChartData = driverPerf.map((d) => ({
    name: `Driver #${d.driver_id}`,
    deliveries: d.total_deliveries,
  }));

  return (
    <Layout title="Analytics & Reports">

      <div className="bg-white rounded-3xl shadow p-8 mb-6">
        <h1 className="text-4xl font-bold">Analytics & Reports</h1>
        <p className="text-slate-500 mt-2">Platform-wide performance overview</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          ["Total Orders", dashboard.total_orders, "from-blue-500 to-blue-700"],
          ["Completed Orders", dashboard.completed_orders, "from-green-500 to-green-700"],
          ["Active Deliveries", dashboard.active_deliveries, "from-orange-500 to-orange-700"],
          ["Cancelled Orders", dashboard.cancelled_orders, "from-red-500 to-red-700"],
        ].map(([label, value, color]) => (
          <div key={label} className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${color}`}>
            <p className="text-sm opacity-90">{label}</p>
            <h2 className="text-4xl font-bold mt-2">{value ?? 0}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">📊 Order Status Breakdown</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  outerRadius={110}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🏪 Vendor Order Volume</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={vendorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">🚚 Driver Delivery Volume</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={driverChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deliveries" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🏪 Vendor Performance</h2>
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {vendorPerf.map((v) => (
                <tr key={v.vendor_id} className="border-t">
                  <td className="p-3">{v.company_name}</td>
                  <td className="p-3 font-bold">{v.total_orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🚚 Driver Performance</h2>
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Driver ID</th>
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Deliveries</th>
              </tr>
            </thead>
            <tbody>
              {driverPerf.map((d) => (
                <tr key={d.driver_id} className="border-t">
                  <td className="p-3">#{d.driver_id}</td>
                  <td className="p-3">{d.vehicle_type}</td>
                  <td className="p-3 font-bold">{d.total_deliveries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </Layout>
  );
}

export default Reports;
