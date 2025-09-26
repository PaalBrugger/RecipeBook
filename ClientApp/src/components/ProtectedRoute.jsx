import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  //Show toast first, then redirect
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Unauthorized - please log in");
      setRedirecting(true);
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  if (!isAuthenticated && redirecting) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

export default ProtectedRoute;
