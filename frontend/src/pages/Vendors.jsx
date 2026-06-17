import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  const loadVendors = async () => {
    try {
      const res = await api.get("/admin/vendors");
      setVendors(res.data);
    } catch (err) {
      console.log(err);
    }
  };
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("/admin/vendors");
      setVendors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);

  const viewVendor = async (id) => {
    try {
      const res = await api.get(`/admin/vendors/${id}`);

      alert(`
Company: ${res.data.company_name}
Phone: ${res.data.phone}
Address: ${res.data.address}
Status: ${res.data.status}
      `);
    } catch (err) {
      console.log(err);
    }
  };

  const editVendor = async (vendor) => {
    const company_name = prompt(
      "Company Name",
      vendor.company_name
    );

    if (!company_name) return;

    try {
      await api.put(`/admin/vendors/${vendor.id}`, {
        company_name,
        phone: vendor.phone,
        address: vendor.address,
        status: vendor.status,
      });

      loadVendors();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete Vendor?")) return;

    try {
      await api.delete(`/admin/vendors/${id}`);
      loadVendors();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.company_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout title="Vendor Management">

      <div className="bg-white rounded-3xl shadow p-8 mb-6">
        <h1 className="text-4xl font-bold">
          Vendors
        </h1>

        <p className="text-slate-500 mt-2">
          Manage all vendors from one place
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">

        <div className="bg-blue-600 text-white p-6 rounded-3xl">
          <h3>Total Vendors</h3>
          <h1 className="text-5xl font-bold">
            {vendors.length}
          </h1>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-3xl">
          <h3>Active Vendors</h3>
          <h1 className="text-5xl font-bold">
            {
              vendors.filter(
                (v) => v.status === "ACTIVE"
              ).length
            }
          </h1>
        </div>

        <div className="bg-red-600 text-white p-6 rounded-3xl">
          <h3>Inactive Vendors</h3>
          <h1 className="text-5xl font-bold">
            {
              vendors.filter(
                (v) => v.status !== "ACTIVE"
              ).length
            }
          </h1>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-3xl">
          <h3>Total Records</h3>
          <h1 className="text-5xl font-bold">
            {vendors.length}
          </h1>
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
              <th className="p-4 text-left">
                Company
              </th>
              <th className="p-4 text-left">
                Phone
              </th>
              <th className="p-4 text-left">
                Address
              </th>
              <th className="p-4 text-left">
                Status
              </th>
              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-t"
              >
                <td className="p-4">
                  {vendor.company_name}
                </td>

                <td className="p-4">
                  {vendor.phone}
                </td>

                <td className="p-4">
                  {vendor.address}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-green-500 text-white">
                    {vendor.status}
                  </span>
                </td>

                <td className="p-4 space-x-2">

                  <button
                    onClick={() =>
                      viewVendor(vendor.id)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      editVendor(vendor)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteVendor(vendor.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </Layout>
  );
}

export default Vendors;