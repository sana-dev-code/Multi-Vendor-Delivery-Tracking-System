/* Settings page with profile and password forms. */
import Layout from "../components/Layout";
import FormInput from "../components/common/FormInput";
import PageHeader from "../components/common/PageHeader";
import { useSettings } from "../hooks/useSettings";

function Settings() {
  const s = useSettings();

  return (
    <Layout title="Settings">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <form onSubmit={s.saveProfile} className="bg-white rounded-3xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="mb-4 p-4 bg-slate-50 rounded-xl"><p className="text-sm text-slate-500">Role</p><p className="font-bold text-lg">{s.user.role || "—"}</p></div>
          <div className="space-y-4"><FormInput label="Full Name" value={s.profileForm.full_name} onChange={(e) => s.setProfileForm({ ...s.profileForm, full_name: e.target.value })} /><FormInput label="Email" value={s.profileForm.email} onChange={(e) => s.setProfileForm({ ...s.profileForm, email: e.target.value })} /></div>
          {s.profileMsg && <p className="text-sm text-green-600 mt-3">{s.profileMsg}</p>}
          <button className="w-full mt-5 bg-blue-700 text-white py-3 rounded-xl font-semibold">Save Profile</button>
        </form>
        <form onSubmit={s.changePassword} className="bg-white rounded-3xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <div className="space-y-4"><FormInput label="Current Password" type="password" value={s.passwordForm.current_password} onChange={(e) => s.setPasswordForm({ ...s.passwordForm, current_password: e.target.value })} /><FormInput label="New Password" type="password" value={s.passwordForm.new_password} onChange={(e) => s.setPasswordForm({ ...s.passwordForm, new_password: e.target.value })} /><FormInput label="Confirm Password" type="password" value={s.passwordForm.confirm_password} onChange={(e) => s.setPasswordForm({ ...s.passwordForm, confirm_password: e.target.value })} /></div>
          {s.passwordMsg && <p className="text-sm text-blue-600 mt-3">{s.passwordMsg}</p>}
          <button className="w-full mt-5 bg-purple-700 text-white py-3 rounded-xl font-semibold">Change Password</button>
        </form>
      </div>
    </Layout>
  );
}
export default Settings;
