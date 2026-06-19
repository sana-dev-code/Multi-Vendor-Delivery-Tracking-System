/* Reports page data hook. */
import { useEffect, useState } from "react";
import api from "../services/api";

export function useReports() {
  const [dashboard, setDashboard] = useState({});
  const [vendorPerf, setVendorPerf] = useState([]);
  const [driverPerf, setDriverPerf] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, vendors, drivers] = await Promise.all([api.get("/reports/dashboard"), api.get("/reports/vendor-performance"), api.get("/reports/driver-performance")]);
        setDashboard(dash.data); setVendorPerf(vendors.data); setDriverPerf(drivers.data);
      } catch (err) { console.log(err); }
    };
    const t = setTimeout(load, 0); return () => clearTimeout(t);
  }, []);

  const orderStatusData = [
    { name: "Delivered", value: dashboard.completed_orders ?? 0 },
    { name: "Active", value: dashboard.active_deliveries ?? 0 },
    { name: "Cancelled", value: dashboard.cancelled_orders ?? 0 },
  ];
  const vendorChartData = vendorPerf.map((v) => ({ name: v.company_name, orders: v.total_orders }));
  const driverChartData = driverPerf.map((d) => ({ name: `Driver #${d.driver_id}`, deliveries: d.total_deliveries }));
  return { dashboard, orderStatusData, vendorChartData, driverChartData };
}
