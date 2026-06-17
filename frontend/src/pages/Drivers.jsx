import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editDriverData, setEditDriverData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [suspendDriverId, setSuspendDriverId] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const [message, setMessage] = useState("");

  const loadDrivers = async () => {
    try {
      const res = await api.get("/admin/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      await loadDrivers();
    };

    fetchDrivers();
  }, []);

  const viewDriver = async (id) => {
    try {
      const res = await api.get(`/admin/drivers/${id}`);
      setSelected(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load driver details.");
    }
  };

  const openEditModal = (driver) => {
    setEditDriverData({
      id: driver.id,
      license_number: driver.license_number || "",
      vehicle_type: driver.vehicle_type || "",
      status: driver.status || "ACTIVE",
    });
    setShowEditModal(true);
  };

  const updateDriver = async () => {
    try {
      await api.put(`/admin/drivers/${editDriverData.id}`, {
        license_number: editDriverData.license_number,
        vehicle_type: editDriverData.vehicle_type,
        status: editDriverData.status,
      });

      setShowEditModal(false);
      setEditDriverData(null);
      setMessage("Driver updated successfully.");
      await loadDrivers();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Failed to update driver.");
    }
  };

  const openSuspendModal = (id) => {
    setSuspendDriverId(id);
    setShowSuspendModal(true);
  };

  const confirmSuspendDriver = async () => {
    try {
      await api.patch(`/admin/drivers/${suspendDriverId}/suspend`);
      setShowSuspendModal(false);
      setSuspendDriverId(null);
      setMessage("Driver suspended successfully.");
      await loadDrivers();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Failed to suspend driver.");
    }
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.license_number?.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicle_type?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "ACTIVE" || status === "AVAILABLE") return "bg-green-500";
    if (status === "SUSPENDED") return "bg-red-500";
    if (status === "BUSY" || status === "ASSIGNED") return "bg-yellow-500";
    return "bg-slate-500";
  };

  return (
    <Layout title="Driver Management">
      <div className="bg-white rounded-3xl shadow p-8 mb-6">
        <h1 className="text-4xl font-bold">Drivers</h1>
        <p className="text-slate-500 mt-2">Manage all drivers from one place</p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-5 py-3 rounded-2xl mb-5 flex justify-between items-center">
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            className="font-bold text-blue-700"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-cyan-600 text-white p-6 rounded-3xl">
          <h3>Total Drivers</h3>
          <h1 className="text-5xl font-bold">{drivers.length}</h1>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-3xl">
          <h3>Active Drivers</h3>
          <h1 className="text-5xl font-bold">
            {
              drivers.filter(
                (d) => d.status === "ACTIVE" || d.status === "AVAILABLE"
              ).length
            }
          </h1>
        </div>

        <div className="bg-red-600 text-white p-6 rounded-3xl">
          <h3>Suspended</h3>
          <h1 className="text-5xl font-bold">
            {drivers.filter((d) => d.status === "SUSPENDED").length}
          </h1>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-3xl">
          <h3>Total Records</h3>
          <h1 className="text-5xl font-bold">{drivers.length}</h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5 mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search by license or vehicle type..."
          className="border p-3 rounded-xl w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Driver ID</th>
              <th className="p-4 text-left">License Number</th>
              <th className="p-4 text-left">Vehicle Type</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No drivers found
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-t">
                  <td className="p-4 font-bold">#{driver.id}</td>
                  <td className="p-4">{driver.license_number}</td>
                  <td className="p-4">{driver.vehicle_type}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${statusColor(
                        driver.status
                      )}`}
                    >
                      {driver.status}
                    </span>
                  </td>

                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => viewDriver(driver.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => openEditModal(driver)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openSuspendModal(driver.id)}
                      disabled={driver.status === "SUSPENDED"}
                      className={`px-3 py-1 rounded text-white ${
                        driver.status === "SUSPENDED"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500"
                      }`}
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showViewModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
            <h2 className="text-2xl font-bold mb-4">🚚 Driver Details</h2>

            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-semibold">ID:</span> {selected.id}
              </p>
              <p>
                <span className="font-semibold">License:</span>{" "}
                {selected.license_number}
              </p>
              <p>
                <span className="font-semibold">Vehicle:</span>{" "}
                {selected.vehicle_type}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selected.status}
              </p>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="mt-6 w-full bg-slate-800 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditModal && editDriverData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[430px]">
            <h2 className="text-2xl font-bold mb-4">✏️ Edit Driver</h2>

            <label className="text-sm text-slate-600">License Number</label>
            <input
              className="w-full border p-3 rounded-xl mb-4 mt-1"
              value={editDriverData.license_number}
              onChange={(e) =>
                setEditDriverData({
                  ...editDriverData,
                  license_number: e.target.value,
                })
              }
            />

            <label className="text-sm text-slate-600">Vehicle Type</label>
            <input
              className="w-full border p-3 rounded-xl mb-4 mt-1"
              value={editDriverData.vehicle_type}
              onChange={(e) =>
                setEditDriverData({
                  ...editDriverData,
                  vehicle_type: e.target.value,
                })
              }
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={updateDriver}
                className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[390px]">
            <h2 className="text-2xl font-bold mb-3">⚠️ Suspend Driver</h2>

            <p className="text-slate-600 mb-6">
              Are you sure you want to suspend this driver?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
              >
                No
              </button>

              <button
                onClick={confirmSuspendDriver}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold"
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Drivers;