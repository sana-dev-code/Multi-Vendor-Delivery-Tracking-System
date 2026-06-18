import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("sana@test.com");
  const [password, setPassword] = useState("123456");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const loginRes = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", loginRes.data.access_token);

    const meRes = await api.get("/auth/me");
    const user = meRes.data;

    localStorage.setItem("user", JSON.stringify(user));


    if (user.role === "ADMIN") navigate("/admin");
    else if (user.role === "VENDOR") navigate("/vendor");
    else if (user.role === "DRIVER") navigate("/driver");
    else navigate("/customer");
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-200">
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚚</div>
          <h1 className="text-3xl font-bold text-slate-800">
            Delivery Tracking
          </h1>
          <p className="text-slate-500 mt-2">
            Multi-Vendor Backend Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="text-sm text-slate-600">Email</label>
          <input
            className="w-full border rounded-lg p-3 mb-4 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-sm text-slate-600">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg p-3 mb-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold">
            Login
          </button>        </form>

        <div className="text-xs text-slate-500 mt-6 space-y-1">
          <p>Admin: sana@test.com / 123456</p>
          <p>Vendor: vendor@test.com / 123456</p>
          <p>Driver: driver@test.com / 123456</p>
          <p>Customer: customer@test.com / 123456</p>
        </div>
        <p className="text-center text-sm text-slate-500 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
    
  );
}

export default Login;