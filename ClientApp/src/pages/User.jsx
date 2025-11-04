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
      <br></br>
      <button onClick={handleLogout} className="btn btn-primary mt-3">
        Signout
      </button>
      <br></br>
      <button className="btn btn-danger mt-3">Delete user</button>
    </div>
  );
}

export default User;
