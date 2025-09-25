import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function PrivateRoute(children) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/Login" />;
}

export default PrivateRoute;
