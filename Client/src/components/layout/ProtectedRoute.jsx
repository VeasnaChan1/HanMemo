/* ProtectedRoute component */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, allowRoles = ["learner", "admin"] }) => {
  const { token, user } = useAuth();

  // Not logged in → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed for this route → redirect appropriately
  if (user && !allowRoles.includes(user.role)) {
    // Admin trying to access learner-only route → send to admin dashboard
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // Learner trying to access admin-only route → send to learner dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
