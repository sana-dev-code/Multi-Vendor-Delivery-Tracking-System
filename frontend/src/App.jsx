import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Vendors from "./pages/Vendors";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

          
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/register" element={<Register />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} /> 
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;