import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateToken = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setResetToken(res.data.reset_token);

      setMessage(
        "✅ Reset token generated. Copy the token below and reset your password."
      );
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Failed to generate reset token."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        reset_token: resetToken,
        new_password: newPassword,
      });

      alert("✅ Password reset successfully.");

      navigate("/");
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-[450px] rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-center text-slate-500 mb-6">
          Reset your account password
        </p>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl mb-4">
            {message}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">
          Email
        </label>

        <input
          type="email"
          className="w-full border p-3 rounded-xl mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleGenerateToken}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold mb-5"
        >
          Generate Reset Token
        </button>

        <label className="block text-sm font-medium mb-1">
          Reset Token
        </label>

        <input
          type="text"
          className="w-full border p-3 rounded-xl mb-4"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          placeholder="Paste reset token"
        />

        <label className="block text-sm font-medium mb-1">
          New Password
        </label>

        <input
          type="password"
          className="w-full border p-3 rounded-xl mb-5"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New strong password"
        />

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold"
        >
          Reset Password
        </button>

        <p className="text-center mt-5 text-sm">
          <Link
            to="/"
            className="text-blue-600 font-semibold"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;