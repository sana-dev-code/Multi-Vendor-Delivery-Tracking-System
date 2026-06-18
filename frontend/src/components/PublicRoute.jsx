import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (token) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "VENDOR":
        return <Navigate to="/vendor" replace />;
      case "DRIVER":
        return <Navigate to="/driver" replace />;
      case "CUSTOMER":
        return <Navigate to="/customer" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default PublicRoute;