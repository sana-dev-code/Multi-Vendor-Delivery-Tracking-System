import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

const STATUS_COLORS = {
  PENDING: "bg-yellow-400",
  CONFIRMED: "bg-blue-500",
  ASSIGNED: "bg-indigo-500",
  PICKED_UP: "bg-purple-500",
  IN_TRANSIT: "bg-orange-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tracking, setTracking] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const trackOrder = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/tracking`);
      setTracking(res.data);
      setTrackingOrderId(orderId);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Could not track order.");
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setSelectedOrderId(null);
    setShowCancelModal(false);
  };

  const confirmCancelOrder = async () => {
    try {
      await api.patch(`/orders/${selectedOrderId}/cancel`);
      closeCancelModal();
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Could not cancel order.");
    }
  };

  const autoAssign = async (orderId) => {
    try {
      const res = await api.post("/deliveries/auto-assign", {
        order_id: orderId,
      });

      alert(res.data?.message || "Driver auto-assigned successfully");
      await loadOrders();
    } catch (err) {
      console.error(err.response?.data);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map((d) => d.msg).join("\n"));
      } else {
        alert(detail || "Auto-assign failed.");
      }
    }
  };

  const filtered = orders.filter((order) => {
    const matchSearch =
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id).includes(search);

    const matchStatus = statusFilter === "ALL" || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const counts = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <Layout title="Orders Management">
      <div className="bg-white rounded-3xl shadow p-8 mb-6">
        <h1 className="text-4xl font-bold">Orders</h1>
        <p className="text-slate-500 mt-2">
          View and manage all orders across vendors
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-blue-600 text-white p-6 rounded-3xl">
          <h3>Total Orders</h3>
          <h1 className="text-5xl font-bold">{counts.total}</h1>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-3xl">
          <h3>Delivered</h3>
          <h1 className="text-5xl font-bold">{counts.delivered}</h1>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-3xl">
          <h3>Pending</h3>
          <h1 className="text-5xl font-bold">{counts.pending}</h1>
        </div>

        <div className="bg-red-600 text-white p-6 rounded-3xl">
          <h3>Cancelled</h3>
          <h1 className="text-5xl font-bold">{counts.cancelled}</h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5 mb-6 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by order number or ID..."
          className="border p-3 rounded-xl w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded-xl"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="PICKED_UP">Picked Up</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Order #</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Pickup</th>
              <th className="p-4 text-left">Delivery</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-4 font-bold">{order.order_number}</td>

                  <td className="p-4">
                    Rs. {Number(order.total_amount || 0).toLocaleString()}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {order.pickup_address}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {order.delivery_address}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        STATUS_COLORS[order.status] || "bg-slate-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => trackOrder(order.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Track
                    </button>

                    {order.status === "PENDING" ? (
                      <button
                        onClick={() => autoAssign(order.id)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Assign
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                      >
                        Assigned
                      </button>
                    )}

                    {order.status !== "DELIVERED" &&
                      order.status !== "CANCELLED" && (
                        <button
                          onClick={() => openCancelModal(order.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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

      {tracking && (
        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              📍 Tracking — Order #{trackingOrderId}
            </h2>

            <button
              onClick={() => setTracking(null)}
              className="text-slate-400 hover:text-slate-700 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Order Number</p>
              <p className="font-bold text-lg">{tracking.order_number}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Order Status</p>
              <p className="font-bold text-lg">{tracking.order_status}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">Delivery Status</p>
              <p className="font-bold text-lg">
                {tracking.delivery_status ?? "Not assigned"}
              </p>
            </div>
          </div>
        </div>
      )}

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
    </Layout>
  );
}

export default Orders;