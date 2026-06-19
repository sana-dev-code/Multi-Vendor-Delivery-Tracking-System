/* Settings profile and password logic. */
import { useState } from "react";
import api from "../services/api";

const strong = /^(?=.{10,}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-]).*$/;

export function useSettings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [profileForm, setProfileForm] = useState({ full_name: user.full_name || "", email: user.email || "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const saveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ ...user, ...profileForm }));
    setProfileMsg("Profile saved locally.");
  };

  const changePassword = async (e) => {
    e.preventDefault(); setPasswordMsg("");
    if (!passwordForm.current_password || !passwordForm.new_password) return setPasswordMsg("Please fill all password fields.");
    if (passwordForm.new_password !== passwordForm.confirm_password) return setPasswordMsg("Passwords do not match.");
    if (!strong.test(passwordForm.new_password)) return setPasswordMsg("New password must be 10+ chars with uppercase, lowercase, number and special character.");
    try { await api.post("/auth/change-password", { current_password: passwordForm.current_password, new_password: passwordForm.new_password }); setPasswordMsg("Password changed successfully."); setPasswordForm({ current_password: "", new_password: "", confirm_password: "" }); }
    catch (err) { setPasswordMsg(err.response?.data?.detail || "Failed to change password."); }
  };

  return { user, profileForm, setProfileForm, passwordForm, setPasswordForm, profileMsg, passwordMsg, saveProfile, changePassword };
}
