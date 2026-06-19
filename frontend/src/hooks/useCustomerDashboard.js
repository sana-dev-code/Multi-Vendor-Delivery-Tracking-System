/* Customer dashboard state and tracking logic. */
import { useEffect, useState } from "react";
import api from "../services/api";

export function useCustomerDashboard() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const profileRes = await api.get("/customers/me");
      setProfile(profileRes.data);
    } catch (err) {
      console.error("Customer profile load failed:", err);
    }

    try {
      const ordersRes = await api.get("/orders/my-orders");
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Customer orders load failed:", err);
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    await loadData();
  };

  fetchData();
}, []);

  const trackOrderById = async (id) => {
    setError("");
    setTracking(null);
    setLoading(true);

    try {
      const res = await api.get(`/orders/${id}/tracking`);
      setTracking(res.data);
      setOrderId(String(id));
    } catch (err) {
      console.error("Order tracking failed:", err);
      setError("Order not found. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return {
    orderId,
    setOrderId,
    tracking,
    profile,
    orders,
    error,
    loading,
    counts,
    trackOrderById,
  };
}