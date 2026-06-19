/* Customer registration page. */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail, FiUser, FiUserPlus } from "react-icons/fi";
import api from "../services/api";
import AuthLayout from "../components/common/AuthLayout";
import FormInput from "../components/common/FormInput";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const strong = /^(?=.{10,}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-]).*$/;

  const submit = async (e) => {
    e.preventDefault(); setMsg({ type: "", text: "" });
    if (!strong.test(form.password)) return setMsg({ type: "error", text: "Password must be 10+ characters with uppercase, lowercase, number, and special character." });
    try { setLoading(true); await api.post("/auth/register", { ...form, role: "CUSTOMER" }); setMsg({ type: "success", text: "Account created. Redirecting..." }); setTimeout(() => navigate("/"), 900); }
    catch (err) { setMsg({ type: "error", text: err.response?.data?.detail || "Registration failed." }); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Customer Register" subtitle="Create customer account to track deliveries" icon={FiUserPlus}>
      {msg.text && <div className={`mb-4 rounded-xl border p-3 text-sm ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</div>}
      <form onSubmit={submit} className="space-y-5">
        <FormInput label="Full Name" icon={FiUser} required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <FormInput label="Email" icon={FiMail} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormInput label="Password" icon={FiLock} type="password" required placeholder="Sana@12345" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <p className="text-[11px] text-slate-500">Must include uppercase, lowercase, number, special character, and minimum 10 characters.</p>
        <button disabled={loading} className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold flex items-center justify-center gap-2">{loading ? "Creating..." : <>Register <FiArrowRight /></>}</button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-7">Already have an account? <Link to="/" className="text-purple-700 font-bold">Login</Link></p>
    </AuthLayout>
  );
}
export default Register;
