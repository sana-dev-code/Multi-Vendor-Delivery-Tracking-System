/* Vendor/driver creation form used by AdminDashboard. */
import { FiBriefcase, FiCreditCard, FiLock, FiMail, FiMap, FiPhone, FiTruck, FiUsers } from "react-icons/fi";
import FormInput from "../common/FormInput";

function AdminAccountForm({ type, form, setForm, onSubmit, onlyName, onlyDigits, onlyLicense }) {
  const vendor = type === "vendor";
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-bold">{vendor ? "Create Vendor" : "Create Driver"}</h2>
      <p className="text-sm text-slate-500 mb-5">Create secure {vendor ? "vendor" : "driver"} account</p>
      <div className="space-y-3">
        <FormInput icon={FiUsers} placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: onlyName(e.target.value) })} required />
        <FormInput icon={FiMail} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.trim() })} required />
        <FormInput icon={FiLock} type="password" placeholder="Strong password e.g. Sana@12345" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {vendor ? (
          <>
            <FormInput icon={FiBriefcase} placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value.slice(0, 80) })} required />
            <FormInput icon={FiPhone} placeholder="Phone e.g. 03001234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: onlyDigits(e.target.value, 11) })} required />
            <FormInput icon={FiMap} placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value.slice(0, 150) })} required />
          </>
        ) : (
          <>
            <FormInput icon={FiCreditCard} placeholder="License number e.g. LEA-12345" value={form.license_number} onChange={(e) => setForm({ ...form, license_number: onlyLicense(e.target.value) })} required />
            <FormInput icon={FiTruck} placeholder="Vehicle type e.g. Bike" value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value.slice(0, 40) })} required />
          </>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-4">Password must include uppercase, lowercase, number, special character and minimum 10 characters.</p>
      <button className={`w-full mt-5 h-12 rounded-xl text-white font-bold shadow-lg ${vendor ? "bg-gradient-to-r from-violet-600 to-fuchsia-600" : "bg-gradient-to-r from-cyan-600 to-blue-600"}`}>{vendor ? "Create Vendor" : "Create Driver"}</button>
    </form>
  );
}
export default AdminAccountForm;
