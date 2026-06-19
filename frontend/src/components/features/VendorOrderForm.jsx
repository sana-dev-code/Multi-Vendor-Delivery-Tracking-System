/* Vendor order creation form. */
import FormInput from "../common/FormInput";

function VendorOrderForm({ form, setForm, customers, onlyAmount, onSubmit, creating, message }) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-bold mb-4">Create New Order</h2>
      {message?.text && <div className={`p-3 rounded-xl mb-4 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message.text}</div>}
      <div className="space-y-4">
        <select className="w-full border border-slate-200 rounded-xl p-3" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
          <option value="">Select Customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name || c.name || c.user?.full_name || "Customer"} - ID #{c.id}</option>)}
        </select>
        <FormInput placeholder="Total amount" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: onlyAmount(e.target.value) })} required />
        <textarea className="w-full border border-slate-200 rounded-xl p-3 min-h-[90px]" placeholder="Pickup address" value={form.pickup_address} onChange={(e) => setForm({ ...form, pickup_address: e.target.value })} required />
        <textarea className="w-full border border-slate-200 rounded-xl p-3 min-h-[90px]" placeholder="Delivery address" value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} required />
      </div>
      <button disabled={creating} className="w-full mt-5 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold disabled:opacity-60">{creating ? "Creating..." : "Create Order"}</button>
    </form>
  );
}
export default VendorOrderForm;
