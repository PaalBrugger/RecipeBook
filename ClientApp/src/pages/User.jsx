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
      console.error("Delete failed:", error);
      toast.error("Failed to delete user");
      return;
    }
    toast.success("Account deleted successfully 🗑️");
    await logout();
    navigate("/");
  }

  return (
    <div>
      <Link to="" className="btn mt-5 btn-primary">
        My recipes
      </Link>
      <br />
      <Link to="/EditUser" className="btn mt-3 btn-primary">
        Edit user
      </Link>
      <br />
      <button onClick={handleLogout} className="btn btn-primary mt-3">
        Signout
      </button>
      <br />
      <button onClick={handleDelete} className="btn btn-danger mt-3">
        Delete user
      </button>
    </div>
  );
}

export default User;
