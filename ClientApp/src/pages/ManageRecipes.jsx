import { useState } from "react";
import { useEffect } from "react";
import BackButton from "../components/BackButton";
import { authFetch } from "../utils/authFetch";
import { useAuth } from "../services/AuthProvider";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ADMIN_GET_ALL_RECIPES, DELETE_RECIPE_URL } from "../utils/apiUrls";

function ManageRecipes() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "id",
    direction: "asc",
  });

  // Fetch recipes
  useEffect(() => {
    authFetch(ADMIN_GET_ALL_RECIPES, {}, logout)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      });
  }, []);

  // Sorting
  function handleSort(column) {
    setRecipes((prev) => {
      let direction = "asc";

      // If clicking same column → toggle direction
      if (sortConfig.column === column && sortConfig.direction === "asc") {
        direction = "desc";
      }

      const sorted = [...prev].sort((a, b) => {
        if (column === "id") {
          return direction === "asc" ? a.id - b.id : b.id - a.id;
        }

        if (column === "name") {
          return direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }

        if (column === "category") {
          return direction === "asc"
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category);
        }

        if (column === "area") {
          return direction === "asc"
            ? a.area.localeCompare(b.area)
            : b.area.localeCompare(a.area);
        }

        if (column === "user") {
          return direction === "asc"
            ? (a.userId ?? "").localeCompare(b.userId ?? "")
            : (b.userId ?? "").localeCompare(a.userId ?? "");
        }

        return 0;
      });

      return sorted;
    });

    // Update sort state after sorting
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  async function handleDeleteRecipe(recipeId) {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      const response = await authFetch(
        `${DELETE_RECIPE_URL}?id=${recipeId}`,
        { method: "DELETE" },
        logout
      );
      if (!response.ok) {
        const error = await response.json();
        console.error("Delete failed:", error);
        toast.error("Failed to delete recipe");
        return;
      }
      toast.success("Recipe Deleted");
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));

      // Catch 401 Unauthorized
    } catch (error) {
      console.log("Request failed:", error.message);
    }
  }

  return (
    <div>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />
      <h1>Manage Recipes</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <table className="mt-5">
          <thead>
            <tr>
              <th>
                <button onClick={() => handleSort("id")}>
                  Id
                  {sortConfig.column === "id" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th>
                <button onClick={() => handleSort("name")}>
                  Name
                  {sortConfig.column === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th>
                <button onClick={() => handleSort("category")}>
                  Category
                  {sortConfig.column === "category" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th>
                <button onClick={() => handleSort("area")}>
                  Area
                  {sortConfig.column === "area" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th>
                <button onClick={() => handleSort("user")}>
                  User
                  {sortConfig.column === "user" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name} </td>
                <td>{r.category} </td>
                <td>{r.area} </td>
                <td>{r.userId} </td>
                <td>
                  <button onClick={() => navigate(`/Recipe/${r.id}`)}>
                    View
                  </button>
                </td>
                <td>
                  <button onClick={() => navigate(`/EditRecipe/${r.id}`)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      handleDeleteRecipe(r.id);
                    }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageRecipes;
