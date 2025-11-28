import { useAuth } from "../services/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function User() {
  const { logout, token } = useAuth();
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

  async function handleDelete(e) {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    const response = await fetch("http://localhost:5091/api/user/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Delete failed:");
      toast.error("Failed to delete user");
      return;
    }
    toast.success("Account deleted successfully 🗑️");
    await logout();
    navigate("/");
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
      <button onClick={handleDelete} className="btn btn-danger mt-3">
        Delete user
      </button>
    </div>
  );
}

export default User;
