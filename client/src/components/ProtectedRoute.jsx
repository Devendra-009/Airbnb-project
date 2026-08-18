import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-center">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
