/* Reports page with responsive charts. */
import Layout from "../components/Layout";
import MetricCard from "../components/common/MetricCard";
import PageHeader from "../components/common/PageHeader";
import { useReports } from "../hooks/useReports";
import { FiCheckCircle, FiClock, FiShoppingBag, FiXCircle } from "react-icons/fi";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Reports() {
  const r = useReports();
  const colors = ["#10b981", "#3b82f6", "#ef4444"];
  return (
    <Layout title="Analytics & Reports">
      <PageHeader title="Analytics & Reports" subtitle="Platform-wide performance overview" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <MetricCard label="Total Orders" value={r.dashboard.total_orders} icon={FiShoppingBag} />
        <MetricCard label="Completed Orders" value={r.dashboard.completed_orders} icon={FiCheckCircle} gradient="from-green-500 to-green-700" />
        <MetricCard label="Active Deliveries" value={r.dashboard.active_deliveries} icon={FiClock} gradient="from-orange-500 to-orange-700" />
        <MetricCard label="Cancelled Orders" value={r.dashboard.cancelled_orders} icon={FiXCircle} gradient="from-red-500 to-red-700" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-3xl shadow-sm border p-6"><h2 className="text-xl font-bold mb-4">Order Status Breakdown</h2><div className="h-[300px]"><ResponsiveContainer><PieChart><Pie data={r.orderStatusData} dataKey="value" outerRadius={100} label>{r.orderStatusData.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>
        <div className="bg-white rounded-3xl shadow-sm border p-6"><h2 className="text-xl font-bold mb-4">Vendor Order Volume</h2><div className="h-[300px]"><ResponsiveContainer><BarChart data={r.vendorChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis /><Tooltip /><Legend /><Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border p-6"><h2 className="text-xl font-bold mb-4">Driver Deliveries</h2><div className="h-[320px]"><ResponsiveContainer><BarChart data={r.driverChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="deliveries" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    </Layout>
  );
}
export default Reports;
