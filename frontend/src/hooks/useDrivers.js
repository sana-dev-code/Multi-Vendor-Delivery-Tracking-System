/* Driver management data and actions. */
import { useEffect, useState } from "react";
import api from "../services/api";

export function useDrivers(showNotice) {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [editDriverData, setEditDriverData] = useState(null);
  const [suspendId, setSuspendId] = useState(null);

  const loadDrivers = async () => {
    try { const res = await api.get("/admin/drivers"); setDrivers(res.data); }
    catch { showNotice("error", "Failed to load drivers."); }
  };

  useEffect(() => { const t = setTimeout(loadDrivers, 0); return () => clearTimeout(t); }, []);

  const viewDriver = async (id) => {
    try { const res = await api.get(`/admin/drivers/${id}`); setSelected(res.data); }
    catch { showNotice("error", "Failed to load driver details."); }
  };

  const updateDriver = async () => {
    try { await api.put(`/admin/drivers/${editDriverData.id}`, editDriverData); setEditDriverData(null); showNotice("success", "Driver updated."); loadDrivers(); }
    catch (err) { showNotice("error", err.response?.data?.detail || "Failed to update driver."); }
  };

  const suspendDriver = async () => {
    try { await api.patch(`/admin/drivers/${suspendId}/suspend`); setSuspendId(null); showNotice("success", "Driver suspended."); loadDrivers(); }
    catch (err) { showNotice("error", err.response?.data?.detail || "Failed to suspend driver."); }
  };

  const filtered = drivers.filter((d) => d.license_number?.toLowerCase().includes(search.toLowerCase()) || d.vehicle_type?.toLowerCase().includes(search.toLowerCase()));
  const active = drivers.filter((d) => d.status === "ACTIVE" || d.status === "AVAILABLE").length;
  const counts = { total: drivers.length, active, suspended: drivers.filter((d) => d.status === "SUSPENDED").length };
  return { drivers, search, setSearch, selected, setSelected, editDriverData, setEditDriverData, suspendId, setSuspendId, filtered, counts, viewDriver, updateDriver, suspendDriver };
}
