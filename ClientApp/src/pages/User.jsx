import { useAuth } from "../services/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_URL } from "../utils/apiUrls";
import { authFetch } from "../utils/authFetch";
import { useEffect } from "react";

function User() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `RecipeBook - ${user?.username}`;
  }, []);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      await logout();
      toast.info("Logged out");
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
    try {
      const response = await authFetch(
        USER_URL,
        {
          method: "DELETE",
        },
        logout
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Delete failed:", error);
        toast.error("Failed to delete user");
        return;
      }
      toast.success("Account deleted successfully 🗑️");
      await logout();
      navigate("/");

      // Catch 401 Unauthorized
    } catch (error) {
      console.log("Request failed:", error.message);
      toast.error("Unauthorized");
    }
  }

  return (
    <div>
      <Link to="/UserRecipes" className="btn mt-5 w-50 btn-primary">
        My Recipes
      </Link>
      <br />
      <Link to="/EditUser" className="btn mt-3 w-50 btn-primary">
        Edit User
      </Link>
      <br />
      <button onClick={handleLogout} className="btn btn-primary w-50 mt-3">
        Logout
      </button>
      <br />
      <button onClick={handleDelete} className="btn btn-danger w-50 mt-3">
        Delete User
      </button>
    </div>
  );
}

export default User;
