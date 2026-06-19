/* Vendor dashboard orders, create order, tracking and profile logic. */
import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY = { customer_id: "", total_amount: "", pickup_address: "", delivery_address: "" };

export function useVendorDashboard(showNotice) {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });
  const [creating, setCreating] = useState(false);
  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [trackErr, setTrackErr] = useState("");
  const [cancelId, setCancelId] = useState(null);

  const loadOrders = async () => { try { const res = await api.get("/orders/my-orders"); setOrders(res.data); } catch {} };
  const loadVendorProfile = async () => { try { const res = await api.get("/vendors/me"); setVendorProfile(res.data); } catch {} };
  const loadCustomers = async () => { try { const res = await api.get("/customers"); setCustomers(res.data); } catch { showNotice("error", "Customers could not be loaded."); } };

  useEffect(() => { const t = setTimeout(() => { loadOrders(); loadVendorProfile(); loadCustomers(); }, 0); return () => clearTimeout(t); }, []);

  const onlyAmount = (v) => v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 12);
  const isSuspended = vendorProfile?.status === "SUSPENDED";
  const createOrder = async (e) => {
    e.preventDefault();
    if (isSuspended) return setFormMsg({ text: "Your vendor account is suspended.", type: "error" });
    if (!form.customer_id || Number(form.customer_id) <= 0) return setFormMsg({ text: "Please select a valid customer.", type: "error" });
    if (!form.total_amount || Number(form.total_amount) <= 0) return setFormMsg({ text: "Total amount must be positive.", type: "error" });
    setCreating(true);
    try { await api.post("/orders", { customer_id: Number(form.customer_id), total_amount: parseFloat(form.total_amount), pickup_address: form.pickup_address, delivery_address: form.delivery_address }); setForm(EMPTY); setFormMsg({ text: "Order created successfully.", type: "success" }); showNotice("success", "Order created."); loadOrders(); }
    catch (err) { setFormMsg({ text: "Failed to create order.", type: "error" }); showNotice("error", err.response?.data?.detail || "Failed to create order."); }
    finally { setCreating(false); }
  };

  const cancelOrder = async () => { try { await api.patch(`/orders/${cancelId}/cancel`); setCancelId(null); showNotice("success", "Order cancelled."); loadOrders(); } catch { showNotice("error", "Cannot cancel this order."); } };
  const autoAssign = async (id) => { try { await api.post("/deliveries/auto-assign", { order_id: id }); showNotice("success", "Driver assigned."); loadOrders(); } catch { showNotice("error", "Auto assign failed."); } };
  const trackOrder = async () => { if (!trackId) return; setTrackErr(""); try { const res = await api.get(`/orders/${trackId}/tracking`); setTracking(res.data); } catch { setTrackErr("Order not found."); } };

  const filtered = orders.filter((o) => (filterStatus === "ALL" || o.status === filterStatus) && (o.order_number?.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search)));
  const counts = { total: orders.length, pending: orders.filter((o) => o.status === "PENDING").length, active: orders.filter((o) => ["CONFIRMED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status)).length, delivered: orders.filter((o) => o.status === "DELIVERED").length, cancelled: orders.filter((o) => o.status === "CANCELLED").length };
  return { orders, customers, vendorProfile, isSuspended, activeTab, setActiveTab, filterStatus, setFilterStatus, search, setSearch, form, setForm, formMsg, creating, trackId, setTrackId, tracking, trackErr, cancelId, setCancelId, onlyAmount, createOrder, cancelOrder, autoAssign, trackOrder, filtered, counts };
}
