import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  };

  useEffect(() => {
  const fetchVendors = async () => {
    try {
      const res = await api.get("/admin/vendors");
      setVendors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchVendors();
}, []);

  const viewVendor = async (id) => {
    try {
      const res = await api.get(`/admin/vendors/${id}`);
      setSelectedVendor(res.data);
    } catch (err) {
      console.log(err);
      showNotice("error", "Failed to load vendor details.");
    }
  };

  const editVendor = async (vendor) => {
    const company_name = prompt("Company Name", vendor.company_name);

    if (!company_name) return;

    try {
      await api.put(`/admin/vendors/${vendor.id}`, {
        company_name,
        phone: vendor.phone,
        address: vendor.address,
        status: vendor.status,
      });

      showNotice("success", "Vendor updated successfully.");
      fetchVendors();
    } catch (err) {
      console.log(err);
      showNotice("error", "Failed to update vendor.");
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete Vendor?")) return;

    try {
      await api.delete(`/admin/vendors/${id}`);
      showNotice("success", "Vendor deleted successfully.");
      fetchVendors();
    } catch (err) {
      console.log(err);
      showNotice("error", "Failed to delete vendor.");
    }
  };

  const fetchVendors = async () => {
  try {
    const res = await api.get("/admin/vendors");
    setVendors(res.data);
  } catch (err) {
    console.log(err);
    showNotice("error", "Failed to load vendors.");
  }
};
useEffect(() => {
  fetchVendors();
}, // eslint-disable-next-line react-hooks/exhaustive-deps
[]);

  const filteredVendors = vendors.filter((vendor) =>
    vendor.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status) => {
    if (status === "ACTIVE") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "SUSPENDED") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <Layout title="Vendor Management">
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

      <div className="bg-white rounded-3xl shadow p-8 mb-6">
        <h1 className="text-4xl font-bold">Vendors</h1>
        <p className="text-slate-500 mt-2">
          Manage all vendors from one place
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-blue-600 text-white p-6 rounded-3xl">
          <h3>Total Vendors</h3>
          <h1 className="text-5xl font-bold">{vendors.length}</h1>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-3xl">
          <h3>Active Vendors</h3>
          <h1 className="text-5xl font-bold">
            {vendors.filter((v) => v.status === "ACTIVE").length}
          </h1>
        </div>

        <div className="bg-red-600 text-white p-6 rounded-3xl">
          <h3>Inactive Vendors</h3>
          <h1 className="text-5xl font-bold">
            {vendors.filter((v) => v.status !== "ACTIVE").length}
          </h1>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-3xl">
          <h3>Total Records</h3>
          <h1 className="text-5xl font-bold">{vendors.length}</h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-5 mb-6 flex justify-between">
        <input
          type="text"
          placeholder="Search Vendor..."
          className="border p-3 rounded-xl w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400">
                  <div className="text-4xl mb-2">📭</div>
                  No vendors found
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-semibold">{vendor.company_name}</td>
                  <td className="p-4">{vendor.phone}</td>
                  <td className="p-4">{vendor.address}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusBadge(
                        vendor.status
                      )}`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => viewVendor(vendor.id)}
                      className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      View
                    </button>

                    <button
                      onClick={() => editVendor(vendor)}
                      className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteVendor(vendor.id)}
                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-[420px]">
            <h2 className="text-2xl font-bold mb-4">🏪 Vendor Details</h2>

            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-semibold">Company:</span>{" "}
                {selectedVendor.company_name}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedVendor.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {selectedVendor.address}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedVendor.status}
              </p>
            </div>

            <button
              onClick={() => setSelectedVendor(null)}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Vendors;