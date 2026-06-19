/* Driver dashboard deliveries and status updates. */
import { useEffect, useState } from "react";
import api from "../services/api";

export function useDriverDashboard(showNotice) {
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, avgTime: "--", rating: "--" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [expandedId, setExpandedId] = useState(null);
  const [historyMap, setHistoryMap] = useState({});
  const [error, setError] = useState(null);

  const fetchDeliveries = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get("/deliveries/my-deliveries");
      const data = res.data.map((d) => ({ ...d, status: d.status || d.current_status }));
      setDeliveries(data); setStats((s) => ({ ...s, total: data.length, completed: data.filter((d) => d.status === "DELIVERED").length }));
    } catch { setError("Deliveries could not be loaded."); }
    finally { setLoading(false); }
  };

  useEffect(() => { const t = setTimeout(fetchDeliveries, 0); return () => clearTimeout(t); }, []);

  const fetchHistory = async (id) => {
    if (historyMap[id]) return;
    try { const res = await api.get(`/deliveries/${id}/history`); setHistoryMap((p) => ({ ...p, [id]: res.data })); }
    catch { setHistoryMap((p) => ({ ...p, [id]: [] })); }
  };

  const toggleExpand = (id) => { setExpandedId(expandedId === id ? null : id); if (expandedId !== id) fetchHistory(id); };
  const updateStatus = async (id, status) => {
    try { await api.put(`/deliveries/${id}/status`, { status }); setDeliveries((p) => p.map((d) => d.id === id ? { ...d, status } : d)); showNotice("success", `Delivery marked as ${status.replace("_", " ")}.`); }
    catch { showNotice("error", "Status update failed."); }
  };

  const activeDelivery = deliveries.find((d) => ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(d.status));
  const queueDeliveries = deliveries.filter((d) => ["ASSIGNED", "PICKED_UP"].includes(d.status) && d.id !== activeDelivery?.id);
  const completedDeliveries = deliveries.filter((d) => ["DELIVERED", "CANCELLED"].includes(d.status));
  return { stats, loading, activeTab, setActiveTab, expandedId, historyMap, error, activeDelivery, queueDeliveries, completedDeliveries, toggleExpand, updateStatus };
}
