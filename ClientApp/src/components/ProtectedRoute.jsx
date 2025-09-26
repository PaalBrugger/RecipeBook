import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

export default ProtectedRoute;
