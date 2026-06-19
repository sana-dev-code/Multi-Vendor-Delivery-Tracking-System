/* Orders page state and API actions. */
import { useEffect, useState } from "react";
import api from "../services/api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tracking, setTracking] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const loadOrders = async () => {
    try { const res = await api.get("/admin/orders"); setOrders(res.data); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { const t = setTimeout(loadOrders, 0); return () => clearTimeout(t); }, []);

  const trackOrder = async (id) => {
    try { const res = await api.get(`/orders/${id}/tracking`); setTracking(res.data); setTrackingOrderId(id); }
    catch (err) { alert(err.response?.data?.detail || "Could not track order."); }
  };

  const autoAssign = async (id) => {
    try { const res = await api.post("/deliveries/auto-assign", { order_id: id }); alert(res.data?.message || "Driver assigned."); loadOrders(); }
    catch (err) { const d = err.response?.data?.detail; alert(Array.isArray(d) ? d.map((x) => x.msg).join("\n") : d || "Auto-assign failed."); }
  };

  const cancelOrder = async () => {
    try { await api.patch(`/orders/${cancelId}/cancel`); setCancelId(null); loadOrders(); }
    catch (err) { alert(err.response?.data?.detail || "Could not cancel order."); }
  };

  const filtered = orders.filter((o) => (statusFilter === "ALL" || o.status === statusFilter) && (o.order_number?.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search)));
  const counts = { total: orders.length, delivered: orders.filter((o) => o.status === "DELIVERED").length, pending: orders.filter((o) => o.status === "PENDING").length, cancelled: orders.filter((o) => o.status === "CANCELLED").length };

  return { search, setSearch, statusFilter, setStatusFilter, tracking, setTracking, trackingOrderId, cancelId, setCancelId, filtered, counts, trackOrder, autoAssign, cancelOrder };
}
