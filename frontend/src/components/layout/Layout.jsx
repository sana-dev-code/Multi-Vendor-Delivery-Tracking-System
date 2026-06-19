/* Admin layout with mobile sidebar support. */
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";

function Layout({ children, title }) {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initial = (user.full_name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 lg:ml-72">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <header className="bg-white shadow-sm px-4 sm:px-8 py-5 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-2xl" onClick={() => setOpen(true)}><FiMenu /></button>
          <div><h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1><p className="text-slate-500 text-sm">Multi Vendor Delivery Tracking Platform</p></div>
        </div>
        <div className="flex items-center gap-3"><div className="text-right hidden sm:block"><h3 className="font-semibold">{user.full_name || "User"}</h3><p className="text-sm text-slate-500">{user.role || "Role"}</p></div><div className="h-11 w-11 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold">{initial}</div></div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
export default Layout;
