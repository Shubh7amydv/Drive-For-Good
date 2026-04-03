import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const raw = localStorage.getItem("golf_auth_user");
  const token = localStorage.getItem("golf_auth_token");

  if (!token || !raw) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(raw);

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
