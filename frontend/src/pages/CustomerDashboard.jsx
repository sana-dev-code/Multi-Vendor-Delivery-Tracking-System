import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

const STATUS_COLORS = {
  PENDING: "bg-yellow-500",
  CONFIRMED: "bg-blue-500",
  PICKED_UP: "bg-indigo-500",
  IN_TRANSIT: "bg-orange-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

function CustomerDashboard() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const loadData = async () => {
    try {
      const profileRes = await api.get("/customers/me");
      setProfile(profileRes.data);
    } catch (err) {
      console.error(err);
    }

    try {
      const ordersRes = await api.get("/orders/my-orders");
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  const trackOrderById = async (id) => {
    setError("");
    setTracking(null);
    setLoading(true);

    try {
      const res = await api.get(`/orders/${id}/tracking`);
      setTracking(res.data);
      setOrderId(String(id));
    } catch {
      setError("Order not found. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async () => {
    if (!orderId) return;
    await trackOrderById(orderId);
  };

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const currentStatus = tracking?.delivery_status ?? tracking?.order_status;
  const stepIndex = currentStatus ? STATUS_STEPS.indexOf(currentStatus) : -1;

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "C";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold">📦 Delivery Tracker</h1>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
            {initials}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-blue-950 text-white px-6 pt-6 pb-16">
        <h2 className="text-2xl font-bold">
          Welcome back{profile?.name ? `, ${profile.name}` : ""} 👋
        </h2>
        <p className="text-blue-200 mt-1">Track your deliveries in real time</p>
      </div>

      <div className="p-6 -mt-10">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow">
            <p>Total Orders</p>
            <h2 className="text-4xl font-bold">{counts.total}</h2>
          </div>

          <div className="bg-yellow-500 text-white p-5 rounded-2xl shadow">
            <p>Pending</p>
            <h2 className="text-4xl font-bold">{counts.pending}</h2>
          </div>

          <div className="bg-green-600 text-white p-5 rounded-2xl shadow">
            <p>Delivered</p>
            <h2 className="text-4xl font-bold">{counts.delivered}</h2>
          </div>

          <div className="bg-red-600 text-white p-5 rounded-2xl shadow">
            <p>Cancelled</p>
            <h2 className="text-4xl font-bold">{counts.cancelled}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            🔍 Track your order
          </p>

          <div className="flex gap-3">
            <input
              className="flex-1 border p-3 rounded-xl"
              placeholder="Enter order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && trackOrder()}
            />

            <button
              onClick={trackOrder}
              disabled={loading}
              className="bg-blue-600 text-white px-6 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {tracking && (
          <div className="bg-white rounded-3xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📍 Tracking Details</h2>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Order Number</p>
                <p className="font-bold">{tracking.order_number}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Order Status</p>
                <p className="font-bold">{tracking.order_status}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Delivery Status</p>
                <p className="font-bold">
                  {tracking.delivery_status ?? "Not dispatched"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Driver</p>
                <p className="font-bold">
                  {tracking.driver_name || tracking.driver_id || "Not assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {STATUS_STEPS.map((step, index) => {
                const done = index <= stepIndex;

                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${
                          done ? "bg-green-500" : "bg-slate-300"
                        }`}
                      >
                        {done ? "✓" : index + 1}
                      </div>

                      <p className="text-xs mt-2 text-center">
                        {step.replace("_", " ")}
                      </p>
                    </div>

                    {index < STATUS_STEPS.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          index < stepIndex ? "bg-green-500" : "bg-slate-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow overflow-hidden mb-6">
          <div className="p-5 border-b">
            <h2 className="text-xl font-bold">📦 My Orders</h2>
            <p className="text-sm text-slate-500">Your recent order history</p>
          </div>

          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Order #</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Pickup</th>
                <th className="p-4 text-left">Delivery</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-bold">{order.order_number}</td>
                    <td className="p-4">Rs. {Number(order.total_amount).toLocaleString()}</td>
                    <td className="p-4 text-sm">{order.pickup_address}</td>
                    <td className="p-4 text-sm">{order.delivery_address}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                          STATUS_COLORS[order.status] || "bg-slate-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => trackOrderById(order.id)}
                        className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-lg text-sm font-semibold"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {profile && (
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">👤 My Profile</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Name</p>
                <p className="font-bold">{profile.name || "Customer"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-bold">{profile.email || "—"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-bold">{profile.phone || "—"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Address</p>
                <p className="font-bold">{profile.address || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;