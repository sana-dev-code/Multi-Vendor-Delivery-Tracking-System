import {
  FaChartPie,
  FaStore,
  FaTruck,
  FaClipboardList,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-slate-950 text-white border-r border-slate-800 z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold">🚚 DeliveryPro</h1>
        <p className="text-slate-400 text-sm mt-1">
          Admin Control Center
        </p>
      </div>

      <div className="p-4 space-y-2">
        <NavLink to="/admin" className={menuClass}>
          <FaChartPie />
          Dashboard
        </NavLink>

        <NavLink to="/vendors" className={menuClass}>
          <FaStore />
          Vendors
        </NavLink>

        <NavLink to="/drivers" className={menuClass}>
          <FaTruck />
          Drivers
        </NavLink>

        <NavLink to="/orders" className={menuClass}>
          <FaClipboardList />
          Orders
        </NavLink>

        <NavLink to="/reports" className={menuClass}>
          <FaChartBar />
          Reports
        </NavLink>

        <NavLink to="/settings" className={menuClass}>
          <FaCog />
          Settings
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;