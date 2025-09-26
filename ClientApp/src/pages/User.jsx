import { useAuth } from "../services/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function User() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await logout();
      toast.info("Logged out");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <div>
      <Link to="/EditUser" className="btn btn-primary">
        Edit user
      </Link>
      <form onSubmit={handleLogout} className="pt-4">
        <button
          type="submit"
          onSubmit={handleLogout}
          className="btn btn-primary"
        >
          Signout
        </button>
      </form>
    </div>
  );
}

export default User;
