/* Login page: API login + token save + role redirect. */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiTruck } from "react-icons/fi";
import api from "../services/api";
import AuthLayout from "../components/common/AuthLayout";
import FormInput from "../components/common/FormInput";

/*const accounts = [
  ["Admin", "sana@test.com", "bg-purple-500"],
  ["Vendor", "vendor@test.com", "bg-sky-500"],
  ["Driver", "driver@test.com", "bg-emerald-500"],
  ["Customer", "customer@test.com", "bg-orange-500"],
];*/

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sana@test.com");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goByRole = (role) => navigate(role === "ADMIN" ? "/admin" : role === "VENDOR" ? "/vendor" : role === "DRIVER" ? "/driver" : "/customer");

  const handleLogin = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const login = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", login.data.access_token);
      const me = await api.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(me.data));
      goByRole(me.data.role);
    } catch (err) { setError(err.response?.data?.detail || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Delivery Tracking" subtitle="Multi-Vendor Backend Dashboard" icon={FiTruck}>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-5">
        <FormInput label="Email" icon={FiMail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
          <div className="flex justify-between"><label className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">Password</label><Link to="/forgot-password" className="text-[11px] text-purple-700 font-bold">Forgot Password?</Link></div>
          <div className="relative mt-2">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input type={show ? "text" : "password"} required className="w-full h-12 rounded-xl border border-slate-200 bg-white/75 pl-11 pr-12 text-sm outline-none focus:ring-4 focus:ring-purple-100" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{show ? <FiEyeOff /> : <FiEye />}</button>
          </div>
        </div>
        <button disabled={loading} className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold flex items-center justify-center gap-2">{loading ? "Signing in..." : <>Sign in <FiArrowRight /></>}</button>
      </form>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">{accounts.map(([label, mail, color]) => <button key={mail} onClick={() => { setEmail(mail); setPassword("123456"); }} className="bg-white/55 border border-white/70 rounded-2xl p-4 text-left"><div className={`w-8 h-1 rounded-full mb-2 ${color}`} /><p className="text-sm font-bold">{label}</p><p className="text-xs text-slate-500">{mail}</p><p className="text-[11px] text-slate-400">Password: 123456</p></button>)}</div> */}
      <p className="text-center text-sm text-slate-600 mt-7">Don&apos;t have an account? <Link to="/register" className="text-purple-700 font-bold">Register</Link></p>
    </AuthLayout>
  );
}
export default Login;
