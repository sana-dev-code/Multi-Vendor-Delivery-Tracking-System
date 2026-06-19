/* Admin dashboard data and create account logic. */
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const strongPasswordRegex = /^(?=.{10,}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-]).*$/;
const phoneRegex = /^03\d{9}$/;
const nameRegex = /^[A-Za-z ]{3,50}$/;
const licenseRegex = /^[A-Za-z0-9-]{4,20}$/;

export function useAdminDashboard(showNotice) {
  const [report, setReport] = useState({});
  const [vendors, setVendors] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vendorForm, setVendorForm] = useState({ full_name: "", email: "", password: "", company_name: "", phone: "", address: "" });
  const [driverForm, setDriverForm] = useState({ full_name: "", email: "", password: "", license_number: "", vehicle_type: "" });

  const loadReports = useCallback(async () => {
    try {
      const [dashboard, vendorPerf, driverPerf] = await Promise.all([api.get("/reports/dashboard"), api.get("/reports/vendor-performance"), api.get("/reports/driver-performance")]);
      setReport(dashboard.data); setVendors(vendorPerf.data); setDrivers(driverPerf.data);
    } catch { showNotice("error", "Failed to load dashboard data."); }
  }, [showNotice]);

  useEffect(() => { const t = setTimeout(loadReports, 0); return () => clearTimeout(t); }, [loadReports]);

  const onlyDigits = (v, n = 11) => v.replace(/\D/g, "").slice(0, n);
  const onlyName = (v) => v.replace(/[^A-Za-z ]/g, "").slice(0, 50);
  const onlyLicense = (v) => v.replace(/[^A-Za-z0-9-]/g, "").slice(0, 20).toUpperCase();

  const createVendor = async (e) => {
    e.preventDefault();
    if (!nameRegex.test(vendorForm.full_name.trim())) return showNotice("error", "Vendor name must contain alphabets only.");
    if (!phoneRegex.test(vendorForm.phone)) return showNotice("error", "Phone must be 11 digits and start with 03.");
    if (!strongPasswordRegex.test(vendorForm.password)) return showNotice("error", "Password must be 10+ chars with uppercase, lowercase, number and special character.");
    try { await api.post("/admin/vendors", vendorForm); showNotice("success", "Vendor created successfully."); setVendorForm({ full_name: "", email: "", password: "", company_name: "", phone: "", address: "" }); loadReports(); }
    catch (err) { showNotice("error", err.response?.data?.detail || "Failed to create vendor."); }
  };

  const createDriver = async (e) => {
    e.preventDefault();
    if (!nameRegex.test(driverForm.full_name.trim())) return showNotice("error", "Driver name must contain alphabets only.");
    if (!licenseRegex.test(driverForm.license_number)) return showNotice("error", "License number must be 4-20 characters.");
    if (!driverForm.vehicle_type.trim()) return showNotice("error", "Vehicle type is required.");
    if (!strongPasswordRegex.test(driverForm.password)) return showNotice("error", "Password must be 10+ chars with uppercase, lowercase, number and special character.");
    try { await api.post("/admin/drivers", driverForm); showNotice("success", "Driver created successfully."); setDriverForm({ full_name: "", email: "", password: "", license_number: "", vehicle_type: "" }); loadReports(); }
    catch (err) { showNotice("error", err.response?.data?.detail || "Failed to create driver."); }
  };

  return { report, vendors, drivers, vendorForm, setVendorForm, driverForm, setDriverForm, onlyDigits, onlyName, onlyLicense, createVendor, createDriver };
}
