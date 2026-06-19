/* Redirects logged-in users away from auth pages. */
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return children;
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "VENDOR") return <Navigate to="/vendor" replace />;
  if (user.role === "DRIVER") return <Navigate to="/driver" replace />;
  if (user.role === "CUSTOMER") return <Navigate to="/customer" replace />;
  localStorage.clear();
  return <Navigate to="/" replace />;
}
export default PublicRoute;
