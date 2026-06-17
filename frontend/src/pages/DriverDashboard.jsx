import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const statusColors = {
  ASSIGNED: "bg-yellow-100 text-yellow-800",
  PICKED_UP: "bg-blue-100 text-blue-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  PENDING: "bg-gray-100 text-gray-700",
};

const STEPS = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

const stepLabels = {
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  DELIVERED: "Delivered",
};

function StepTimeline({ status }) {
  const currentIdx = STEPS.indexOf(status);

  return (
    <div className="flex items-center my-4">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border ${
                i < currentIdx
                  ? "bg-green-100 text-green-700 border-green-300"
                  : i === currentIdx
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-gray-100 text-gray-400 border-gray-200"
              }`}
            >
              {i < currentIdx ? "✓" : i + 1}
            </div>

            <span className="text-[10px] text-gray-500 mt-1 text-center w-14">
              {stepLabels[step]}
            </span>
          </div>

          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-px mx-1 mb-4 ${
                i < currentIdx ? "bg-green-300" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgTime: "--",
    rating: "--",
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [expandedId, setExpandedId] = useState(null);
  const [historyMap, setHistoryMap] = useState({});
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  async function fetchDeliveries() {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/deliveries/my-deliveries");

      console.log(res.data);

      setDeliveries(res.data);

      const data = res.data.map((d) => ({
        ...d,
        status: d.status || d.current_status,
      }));

      setDeliveries(data);

      const completed = data.filter((d) => d.status === "DELIVERED").length;

      setStats((s) => ({
        ...s,
        total: data.length,
        completed,
      }));
    } catch {
      setError("Deliveries load nahi ho sakien. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDeliveries();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function fetchHistory(deliveryId) {
    if (historyMap[deliveryId]) return;

    try {
      const res = await api.get(`/deliveries/${deliveryId}/history`);

      setHistoryMap((prev) => ({
        ...prev,
        [deliveryId]: res.data,
      }));
    } catch {
      setHistoryMap((prev) => ({
        ...prev,
        [deliveryId]: [],
      }));
    }
  }

  function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchHistory(id);
    }
  }

  async function updateStatus(deliveryId, newStatus) {
    try {
      await api.put(`/deliveries/${deliveryId}/status`, {
        status: newStatus,
      });

      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId ? { ...d, status: newStatus } : d
        )
      );

      showNotice("success", `Delivery marked as ${newStatus.replace("_", " ")}.`);
    } catch {
      showNotice("error", "Status update nahi ho saka. Dobara try karein.");
    }
  }

  const activeDelivery = deliveries.find((d) =>
    ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(d.status)
  );

  const queueDeliveries = deliveries.filter(
    (d) =>
      ["ASSIGNED", "PICKED_UP"].includes(d.status) &&
      d.id !== activeDelivery?.id
  );

  const completedDeliveries = deliveries.filter((d) =>
    ["DELIVERED", "CANCELLED"].includes(d.status)
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Driver Dashboard" />

      {notice && (
        <div
          className={`fixed top-6 right-6 z-[999] rounded-2xl shadow-xl px-6 py-4 border ${
            notice.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {notice.type === "success" ? "✅" : "⚠️"}
            </span>

            <p className="font-semibold">{notice.text}</p>

            <button onClick={() => setNotice(null)} className="ml-3 font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-8 shadow-xl mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-1">
                Driver Portal
              </p>

              <h1 className="text-3xl font-bold">Driver Dashboard</h1>

              <p className="text-blue-100 mt-1">
                Manage assigned deliveries and update delivery progress.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 text-sm font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              On duty
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Today", value: stats.total, sub: "deliveries", color: "bg-blue-600" },
            { label: "Completed", value: stats.completed, sub: "this shift", color: "bg-green-600" },
            { label: "Avg Time", value: stats.avgTime, sub: "per delivery", color: "bg-orange-500" },
            { label: "Rating", value: stats.rating, sub: "last 30 days", color: "bg-purple-600" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} text-white rounded-2xl p-5 shadow`}>
              <p className="text-sm opacity-90">{s.label}</p>
              <h2 className="text-4xl font-bold mt-1">{s.value}</h2>
              <p className="text-xs opacity-80 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow p-5">
          <div className="flex gap-2 border-b border-slate-200 mb-5">
            {[
              { key: "active", label: "Active Delivery" },
              { key: "queue", label: `Queue (${queueDeliveries.length})` },
              { key: "history", label: "History" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">
              Loading deliveries...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <>
              {activeTab === "active" && (
                <>
                  {activeDelivery ? (
                    <div className="border border-slate-200 rounded-2xl p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold">
                            Order #{activeDelivery.order_id || activeDelivery.id}
                          </h2>

                          <p className="text-slate-500 text-sm mt-1">
                            {activeDelivery.vendor_name || "Vendor"} →{" "}
                            {activeDelivery.delivery_address || "Delivery address"}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[activeDelivery.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {activeDelivery.status?.replace("_", " ")}
                        </span>
                      </div>

                      <StepTimeline status={activeDelivery.status} />

                      <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="text-slate-400 text-xs">Destination</p>
                          <p className="font-semibold text-slate-800">
                            {activeDelivery.delivery_address || "Not available"}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="text-slate-400 text-xs">Customer</p>
                          <p className="font-semibold text-slate-800">
                            {activeDelivery.customer_name || "Customer"}
                            {activeDelivery.customer_phone &&
                              ` · ${activeDelivery.customer_phone}`}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="text-slate-400 text-xs">Vendor</p>
                          <p className="font-semibold text-slate-800">
                            {activeDelivery.vendor_name || "Vendor"}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                          <p className="text-slate-400 text-xs">Created At</p>
                          <p className="font-semibold text-slate-800">
                            {activeDelivery.created_at
                              ? new Date(activeDelivery.created_at).toLocaleString()
                              : "--"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap mt-5">
                        {activeDelivery.status === "ASSIGNED" && (
                          <button
                            onClick={() =>
                              updateStatus(activeDelivery.id, "PICKED_UP")
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
                          >
                            ✓ Confirm Pickup
                          </button>
                        )}

                        {activeDelivery.status === "PICKED_UP" && (
                          <button
                            onClick={() =>
                              updateStatus(activeDelivery.id, "IN_TRANSIT")
                            }
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold"
                          >
                            🚗 Start Transit
                          </button>
                        )}

                        {activeDelivery.status === "IN_TRANSIT" && (
                          <button
                            onClick={() =>
                              updateStatus(activeDelivery.id, "DELIVERED")
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
                          >
                            ✓ Mark Delivered
                          </button>
                        )}

                        {activeDelivery.customer_phone && (
                          <a
                            href={`tel:${activeDelivery.customer_phone}`}
                            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-semibold"
                          >
                            📞 Call Customer
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-14 text-slate-400">
                      Abhi koi active delivery nahi hai.
                    </div>
                  )}
                </>
              )}

              {activeTab === "queue" && (
                <div className="space-y-3">
                  {queueDeliveries.length === 0 ? (
                    <div className="text-center py-14 text-slate-400">
                      Queue khali hai.
                    </div>
                  ) : (
                    queueDeliveries.map((d) => (
                      <div
                        key={d.id}
                        className="border border-slate-200 rounded-2xl p-4"
                      >
                        <div
                          onClick={() => toggleExpand(d.id)}
                          className="flex justify-between items-center cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold">
                              #{d.order_id || d.id} ·{" "}
                              {d.delivery_address || "Delivery address"}
                            </p>

                            <p className="text-sm text-slate-500">
                              {d.vendor_name || "Vendor"} →{" "}
                              {d.customer_name || "Customer"}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusColors[d.status] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {d.status?.replace("_", " ")}
                          </span>
                        </div>

                        {expandedId === d.id && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            {historyMap[d.id] ? (
                              historyMap[d.id].length > 0 ? (
                                historyMap[d.id].map((h, i) => (
                                  <div key={i} className="text-sm text-slate-600 mb-2">
                                    ✓ {h.status}{" "}
                                    {h.timestamp
                                      ? new Date(h.timestamp).toLocaleString()
                                      : ""}
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-400">
                                  Koi history nahi mili.
                                </p>
                              )
                            ) : (
                              <p className="text-sm text-slate-400">
                                Loading history...
                              </p>
                            )}

                            {d.status === "ASSIGNED" && (
                              <button
                                onClick={() => updateStatus(d.id, "PICKED_UP")}
                                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                              >
                                ✓ Confirm Pickup
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-3">
                  {completedDeliveries.length === 0 ? (
                    <div className="text-center py-14 text-slate-400">
                      Abhi tak koi delivery complete nahi hui.
                    </div>
                  ) : (
                    completedDeliveries.map((d) => (
                      <div
                        key={d.id}
                        className="border border-slate-200 rounded-2xl p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">
                            #{d.order_id || d.id} ·{" "}
                            {d.delivery_address || "Delivery address"}
                          </p>

                          <p className="text-sm text-slate-500">
                            {d.vendor_name || "Vendor"} →{" "}
                            {d.customer_name || "Customer"}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[d.status] ||
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;