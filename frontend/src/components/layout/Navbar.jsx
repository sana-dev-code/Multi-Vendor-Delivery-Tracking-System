/* Top bar for customer, vendor and driver pages. */
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Navbar({ title }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <header className="bg-white shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center border-b border-slate-100">
      <div><h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1><p className="text-sm text-slate-500">Logged in as {user.role || "User"}</p></div>
      <button onClick={logout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"><FiLogOut />Logout</button>
    </header>
  );
}
export default Navbar;
