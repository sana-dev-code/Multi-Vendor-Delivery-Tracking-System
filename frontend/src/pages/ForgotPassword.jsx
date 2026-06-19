/* Forgot password page: generate token and reset password. */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiKey, FiLock, FiMail } from "react-icons/fi";
import api from "../services/api";
import AuthLayout from "../components/common/AuthLayout";
import FormInput from "../components/common/FormInput";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try { setLoading(true); const res = await api.post("/auth/forgot-password", { email }); setResetToken(res.data.reset_token); setMsg({ type: "success", text: "Reset token generated." }); }
    catch (err) { setMsg({ type: "error", text: err.response?.data?.detail || "Failed to generate token." }); }
    finally { setLoading(false); }
  };

  const reset = async () => {
    try { setLoading(true); await api.post("/auth/reset-password", { email, reset_token: resetToken, new_password: newPassword }); setMsg({ type: "success", text: "Password reset. Redirecting..." }); setTimeout(() => navigate("/"), 900); }
    catch (err) { setMsg({ type: "error", text: err.response?.data?.detail || "Reset failed." }); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Reset your account password" icon={FiKey}>
      {msg.text && <div className={`mb-4 rounded-xl border p-3 text-sm ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</div>}
      <div className="space-y-5">
        <FormInput label="Email" icon={FiMail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={generate} disabled={loading || !email} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold disabled:opacity-60">Generate Reset Token</button>
        <FormInput label="Reset Token" icon={FiKey} value={resetToken} onChange={(e) => setResetToken(e.target.value)} />
        <FormInput label="New Password" icon={FiLock} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button onClick={reset} disabled={loading || !email || !resetToken || !newPassword} className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60">Reset Password <FiArrowRight /></button>
      </div>
      <p className="text-center text-sm text-slate-600 mt-7"><Link to="/" className="text-purple-700 font-bold">Back to Login</Link></p>
    </AuthLayout>
  );
}
export default ForgotPassword;
