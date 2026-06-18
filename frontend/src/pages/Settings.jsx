import Layout from "../components/Layout";
import { useState } from "react";
import api from "../services/api";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profileForm, setProfileForm] = useState({
    full_name: user.full_name || "",
    email: user.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const strongPasswordRegex = /^(?=.{10,}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-]).*$/;

  const saveProfile = async (e) => {
    e.preventDefault();

    const updated = { ...user, ...profileForm };
    localStorage.setItem("user", JSON.stringify(updated));

    setProfileMsg("Profile saved locally.");
  };

  const changePassword = async (e) => {
    e.preventDefault();

    setPasswordMsg("");

    if (!passwordForm.current_password || !passwordForm.new_password) {
      setPasswordMsg("Please fill all password fields.");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg("Passwords do not match.");
      return;
    }

    if (!strongPasswordRegex.test(passwordForm.new_password)) {
      setPasswordMsg("New password must be 10+ chars, no spaces, uppercase, lowercase, number and special character (@$!%*?&#_-).");
      return;
    }

    try {
      await api.post("/auth/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      setPasswordMsg("Password changed successfully.");
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error(err);
      setPasswordMsg(
        err.response?.data?.detail || "Failed to change password."
      );
    }
  };

  return (
    <Layout title="Settings">
      <div className="bg-white rounded-3xl shadow p-8 mb-6">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-slate-500 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <form onSubmit={saveProfile} className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">👤 Profile Information</h2>

          <div className="mb-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-500">Role</p>
            <p className="font-bold text-lg">{user.role || "—"}</p>
          </div>

          <label className="text-sm text-slate-600 block mb-1">Full Name</label>
          <input
            className="w-full border p-3 rounded-lg mb-4"
            value={profileForm.full_name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, full_name: e.target.value })
            }
          />

          <label className="text-sm text-slate-600 block mb-1">Email</label>
          <input
            className="w-full border p-3 rounded-lg mb-4"
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm({ ...profileForm, email: e.target.value })
            }
          />

          {profileMsg && (
            <p className="text-sm text-green-600 mb-3">{profileMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Save Profile
          </button>
        </form>

        <form onSubmit={changePassword} className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔒 Change Password</h2>

          {["current_password", "new_password", "confirm_password"].map((field) => (
            <div key={field} className="mb-4">
              <label className="text-sm text-slate-600 block mb-1">
                {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <input
                type="password"
                className="w-full border p-3 rounded-lg"
                value={passwordForm[field]}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, [field]: e.target.value })
                }
              />
            </div>
          ))}

          {passwordMsg && (
            <p
              className={`text-sm mb-3 ${
                passwordMsg.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-3 rounded-lg font-semibold"
          >
            Change Password
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">ℹ️ Account Information</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["User ID", user.id],
            ["Full Name", user.full_name],
            ["Email", user.email],
            ["Role", user.role],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 p-4 rounded-xl">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="font-semibold">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Settings;