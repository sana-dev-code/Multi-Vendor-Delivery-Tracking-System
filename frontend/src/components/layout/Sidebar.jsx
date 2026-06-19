/* Responsive admin sidebar with professional icons. */
import { FaChartPie, FaStore, FaTruck, FaClipboardList, FaChartBar, FaCog } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { NavLink } from "react-router-dom";

function Sidebar({ open, onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const item = ({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium ${isActive ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`;

  return (
    <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800 flex flex-col z-50 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center"><FiPackage className="text-white text-xl" /></div>
          <div><h1 className="text-xl font-bold text-white">DeliveryPro</h1><p className="text-slate-400 text-xs">Admin Control Center</p></div>
        </div>
        <button className="lg:hidden text-white" onClick={onClose}>×</button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to="/admin" className={item}><FaChartPie />Dashboard</NavLink>
        <NavLink to="/vendors" className={item}><FaStore />Vendors</NavLink>
        <NavLink to="/drivers" className={item}><FaTruck />Drivers</NavLink>
        <NavLink to="/orders" className={item}><FaClipboardList />Orders</NavLink>
        <NavLink to="/reports" className={item}><FaChartBar />Reports</NavLink>
        <NavLink to="/settings" className={item}><FaCog />Settings</NavLink>
      </nav>
      <div className="p-4 border-t border-slate-800"><div className="bg-slate-900 rounded-2xl p-4"><p className="text-xs text-slate-400 uppercase tracking-widest">Logged In</p><p className="text-white font-semibold mt-1">{user.full_name || "User"}</p><p className="text-slate-400 text-sm">{user.role || "Role"}</p></div></div>
    </aside>
  );
}
export default Sidebar;
