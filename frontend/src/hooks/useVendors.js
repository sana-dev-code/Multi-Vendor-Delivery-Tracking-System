/* Vendor management data and actions. */
import { useEffect, useState } from "react";
import api from "../services/api";

export function useVendors(showNotice) {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = async () => {
    try { const res = await api.get("/admin/vendors"); setVendors(res.data); }
    catch { showNotice("error", "Failed to load vendors."); }
  };

  useEffect(() => { const t = setTimeout(fetchVendors, 0); return () => clearTimeout(t); }, []);

  const viewVendor = async (id) => {
    try { const res = await api.get(`/admin/vendors/${id}`); setSelectedVendor(res.data); }
    catch { showNotice("error", "Failed to load vendor details."); }
  };

  const editVendor = async (vendor) => {
    const company_name = prompt("Company Name", vendor.company_name);
    if (!company_name) return;
    try { await api.put(`/admin/vendors/${vendor.id}`, { company_name, phone: vendor.phone, address: vendor.address, status: vendor.status }); showNotice("success", "Vendor updated."); fetchVendors(); }
    catch { showNotice("error", "Failed to update vendor."); }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete Vendor?")) return;
    try { await api.delete(`/admin/vendors/${id}`); showNotice("success", "Vendor deleted."); fetchVendors(); }
    catch { showNotice("error", "Failed to delete vendor."); }
  };

  const filtered = vendors.filter((v) => v.company_name?.toLowerCase().includes(search.toLowerCase()));
  const counts = { total: vendors.length, active: vendors.filter((v) => v.status === "ACTIVE").length, inactive: vendors.filter((v) => v.status !== "ACTIVE").length };
  return { vendors, search, setSearch, selectedVendor, setSelectedVendor, filtered, counts, viewVendor, editVendor, deleteVendor };
}
