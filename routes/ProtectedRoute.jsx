import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Kullanıcı yoksa login'e at
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol yetkisi yoksa unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Her şey OK
  return children;
}
