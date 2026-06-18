import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const strongPasswordRegex = /^(?=.{10,}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-]).*$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!strongPasswordRegex.test(form.password)) {
      alert("Customer password must be 10+ chars, no spaces, uppercase, lowercase, number and special character (@$!%*?&#_-).");
      return;
    }

    try {
      await api.post("/auth/register", {
        ...form,
        role: "CUSTOMER",
      });

      alert("Customer account created successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white w-[430px] rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Customer Register</h1>
        <p className="text-center text-slate-500 mb-6">
          Create customer account to track deliveries
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="w-full border p-3 rounded-xl"
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />

          <input
            className="w-full border p-3 rounded-xl"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="w-full border p-3 rounded-xl"
            placeholder="Strong Password e.g. Sana@12345"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold">
            Register as Customer
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;