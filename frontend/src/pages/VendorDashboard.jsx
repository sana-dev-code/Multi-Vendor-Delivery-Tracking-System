import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const STATUS_COLORS = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-400" },
  CONFIRMED: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  ASSIGNED: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  PICKED_UP: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  IN_TRANSIT: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  DELIVERED: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const STEPS = ["PENDING", "CONFIRMED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

const EMPTY_FORM = {
  customer_id: "",
  total_amount: "",
  pickup_address: "",
  delivery_address: "",
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function VendorDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [orders, setOrders] = useState([]);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });
  const [creating, setCreating] = useState(false);

  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [trackErr, setTrackErr] = useState("");

  const [notice, setNotice] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelOrderId, setSelectedCancelOrderId] = useState(null);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadVendorProfile = async () => {
    try {
      const res = await api.get("/vendors/me");
      setVendorProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadOrders();
      await loadVendorProfile();
    };

    fetchData();
  }, []);

  const createOrder = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFormMsg({ text: "", type: "" });

    try {
      await api.post("/orders", {
        customer_id: Number(form.customer_id),
        total_amount: parseFloat(form.total_amount),
        pickup_address: form.pickup_address,
        delivery_address: form.delivery_address,
      });

      setFormMsg({ text: "✅ Order created successfully!", type: "success" });
      showNotice("success", "Order created successfully.");
      setForm(EMPTY_FORM);
      await loadOrders();
    } catch (err) {
      console.error(err);
      setFormMsg({ text: "❌ Failed to create order. Check all fields.", type: "error" });
      showNotice("error", err.response?.data?.detail || "Failed to create order.");
    } finally {
      setCreating(false);
    }
  };

  const openCancelModal = (id) => {
    setSelectedCancelOrderId(id);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setSelectedCancelOrderId(null);
    setShowCancelModal(false);
  };

  const confirmCancelOrder = async () => {
    try {
      await api.patch(`/orders/${selectedCancelOrderId}/cancel`);
      closeCancelModal();
      showNotice("success", "Order cancelled successfully.");
      await loadOrders();
    } catch (err) {
      console.error(err);
      showNotice("error", err.response?.data?.detail || "Cannot cancel this order.");
    }
  };
  const autoAssign = async (orderId) => {
  try {
    await api.post("/deliveries/auto-assign", {
      order_id: orderId,
    });

    showNotice("success", "Driver assigned successfully.");
    await loadOrders();
  } catch (err) {
    console.error(err);
    showNotice(
      "error",
      err.response?.data?.detail || "Auto assign failed."
    );
  }
};

  const trackOrder = async () => {
    if (!trackId) return;

    setTrackErr("");
    setTracking(null);

    try {
      const res = await api.get(`/orders/${trackId}/tracking`);
      setTracking(res.data);
    } catch {
      setTrackErr("Order not found. Please check the Order ID.");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);

    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    active: orders.filter((o) =>
      ["CONFIRMED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status)
    ).length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const stepIndex = tracking
    ? STEPS.indexOf(tracking.delivery_status ?? tracking.order_status)
    : -1;

  const tabs = [
    { id: "orders", label: "📦 My Orders" },
    { id: "create", label: "➕ New Order" },
    { id: "track", label: "📍 Track Order" },
    { id: "profile", label: "🏪 Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Vendor Dashboard" />

      {notice && (
        <div
          className={`fixed top-6 right-6 z-[999] rounded-2xl shadow-xl px-6 py-4 border ${
            notice.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{notice.type === "success" ? "✅" : "⚠️"}</span>
            <p className="font-semibold">{notice.text}</p>
            <button onClick={() => setNotice(null)} className="ml-3 font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 text-white p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
                Vendor Portal
              </p>
              <h1 className="text-3xl font-bold">{user.full_name || "Vendor User"}</h1>
              <p className="text-blue-200 mt-1">
                Manage your orders, track deliveries, and grow your business.
              </p>
            </div>

            <div className="text-6xl opacity-20">🏪</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            ["Total Orders", counts.total, "from-blue-500 to-blue-700"],
            ["Pending", counts.pending, "from-yellow-400 to-yellow-600"],
            ["In Progress", counts.active, "from-orange-500 to-orange-700"],
            ["Delivered", counts.delivered, "from-green-500 to-green-700"],
            ["Cancelled", counts.cancelled, "from-red-500 to-red-700"],
          ].map(([label, val, color]) => (
            <div key={label} className={`rounded-2xl p-5 text-white shadow bg-gradient-to-br ${color}`}>
              <p className="text-xs opacity-80 uppercase tracking-wide">{label}</p>
              <h2 className="text-4xl font-bold mt-1">{val}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-slate-500 text-sm">Total Revenue</p>
            <h2 className="text-3xl font-bold text-green-600">
              Rs. {totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-slate-500 text-sm">Average Order Value</p>
            <h2 className="text-3xl font-bold text-blue-600">
              Rs. {orders.length ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow">
            <p className="text-slate-500 text-sm">Success Rate</p>
            <h2 className="text-3xl font-bold text-indigo-600">
              {orders.length ? Math.round((counts.delivered / orders.length) * 100) : 0}%
            </h2>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm ${
                activeTab === t.id
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl shadow overflow-hidden">
            <div className="p-5 border-b flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search by order number..."
                className="border p-2.5 rounded-xl w-72 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="border p-2.5 rounded-xl text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                {["PENDING", "CONFIRMED", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <span className="ml-auto text-sm text-slate-400">{filtered.length} orders</span>
            </div>

            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wide">
                <tr>
                  <th className="p-4 text-left">Order #</th>
                  <th className="p-4 text-left">Customer ID</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Pickup</th>
                  <th className="p-4 text-left">Delivery</th>
                  <th className="p-4 text-left">Driver</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <div className="text-4xl mb-2">📭</div>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800">{order.order_number}</td>
                      <td className="p-4 text-slate-500">#{order.customer_id}</td>
                      <td className="p-4 font-semibold">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-[150px] truncate">
                        {order.pickup_address}
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-[150px] truncate">
                        {order.delivery_address}
                      </td>
                      <td className="p-4 text-sm">
                        {order.driver_name || order.driver_id || "Not assigned"}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4 space-x-2">
  <button
    onClick={() => {
      setTrackId(String(order.id));
      setActiveTab("track");
    }}
    className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-lg text-xs font-semibold"
  >
    Track
  </button>

  {order.status === "PENDING" && (
    <button
      onClick={() => autoAssign(order.id)}
      className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-semibold"
    >
      Assign Driver
    </button>
  )}

  {!["DELIVERED", "CANCELLED"].includes(order.status) && (
    <button
      onClick={() => openCancelModal(order.id)}
      className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-xs font-semibold"
    >
      Cancel
    </button>
  )}
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "create" && (
          <div className="bg-white rounded-3xl shadow p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-1">Create New Order</h2>
            <p className="text-slate-500 text-sm mb-6">
              Fill in delivery details to place a new order.
            </p>

            <form onSubmit={createOrder} className="space-y-4">
              <input
                required
                type="number"
                className="w-full border p-3 rounded-xl"
                placeholder="Customer ID"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              />

              <input
                required
                type="number"
                step="0.01"
                className="w-full border p-3 rounded-xl"
                placeholder="Total Amount"
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
              />

              <textarea
                required
                rows={2}
                className="w-full border p-3 rounded-xl"
                placeholder="Pickup Address"
                value={form.pickup_address}
                onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
              />

              <textarea
                required
                rows={2}
                className="w-full border p-3 rounded-xl"
                placeholder="Delivery Address"
                value={form.delivery_address}
                onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
              />

              {formMsg.text && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium ${
                    formMsg.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {formMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-indigo-700 text-white py-3 rounded-xl font-semibold"
              >
                {creating ? "Creating..." : "Place Order"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "track" && (
          <div className="max-w-3xl bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-1">Track Order</h2>
            <p className="text-slate-500 text-sm mb-6">
              Enter an Order ID to see delivery progress.
            </p>

            <div className="flex gap-3 mb-6">
              <input
                className="flex-1 border p-3 rounded-xl"
                placeholder="Enter Order ID"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && trackOrder()}
              />

              <button
                onClick={trackOrder}
                className="bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Track
              </button>
            </div>

            {trackErr && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-4">
                {trackErr}
              </div>
            )}

            {tracking && (
              <div>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1">Order Number</p>
                    <p className="font-bold text-slate-800">{tracking.order_number}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1">Order Status</p>
                    <p className="font-bold text-slate-800">{tracking.order_status}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1">Delivery Status</p>
                    <p className="font-bold text-slate-800">
                      {tracking.delivery_status ?? "Not dispatched"}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1">Driver</p>
                    <p className="font-bold text-slate-800">
                      {tracking.driver_name || tracking.driver_id || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm font-semibold text-slate-600 mb-4">
                    Delivery Progress
                  </p>

                  <div className="relative">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-green-500"
                      style={{
                        width:
                          stepIndex >= 0
                            ? `${(stepIndex / (STEPS.length - 1)) * 100}%`
                            : "0%",
                      }}
                    />

                    <div className="relative flex justify-between">
                      {STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center w-16">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 ${
                              i <= stepIndex
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-slate-300 text-slate-400"
                            }`}
                          >
                            {i <= stepIndex ? "✓" : i + 1}
                          </div>
                          <p className="text-xs text-slate-500 mt-2 text-center leading-tight">
                            {step.replace("_", " ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Vendor Profile</h2>

              <div className="space-y-3 text-slate-700">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {user.full_name || "Vendor User"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {user.email || "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Company:</span>{" "}
                  {vendorProfile?.company_name || "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {vendorProfile?.phone || "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {vendorProfile?.address || "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {vendorProfile?.status || "ACTIVE"}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8">
              <h3 className="font-bold text-indigo-800 mb-3">
                Vendor Responsibilities
              </h3>
              <ul className="text-sm text-indigo-700 space-y-2 list-disc list-inside">
                <li>Create customer delivery orders.</li>
                <li>Monitor order and delivery status.</li>
                <li>Cancel orders before delivery completion.</li>
                <li>Track assigned driver and delivery progress.</li>
                <li>Review revenue and business performance.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[380px]">
            <h2 className="text-2xl font-bold mb-3">⚠️ Cancel Order</h2>

            <p className="text-slate-600 mb-6">
              Are you sure you want to cancel this order?
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
              >
                No
              </button>

              <button
                onClick={confirmCancelOrder}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;