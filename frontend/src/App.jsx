import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Vendors from "./pages/Vendors";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
  }
/>
        
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Vendors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Drivers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Vendor */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Driver */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "VENDOR",
                "DRIVER",
                "CUSTOMER",
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;