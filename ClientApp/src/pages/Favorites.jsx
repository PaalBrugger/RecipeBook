import { useEffect, useState } from "react";
import { GET_FAVORITED_RECIPES_URL } from "../utils/apiUrls";
import { useAuth } from "../services/AuthProvider";
import { authFetch } from "../utils/authFetch";
import { toast } from "react-toastify";
import RecipeContainer from "../components/RecipeContainer";

function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await authFetch(GET_FAVORITED_RECIPES_URL, {}, logout);
        const data = await res.json();
        setRecipes(data);
        setIsLoading(false);

        // Catch 401 Unauthorized
      } catch (error) {
        console.log("Request failed:", error.message);
        toast.error("Unauthorized");
      }
    }
    fetchFavorites();
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const paginatedRecipes = recipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  return (
    <div className="py-2">
      <h2 className="mb-4">Your Favorite Recipes 🍽️</h2>
      <RecipeContainer
        recipes={paginatedRecipes}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Favorites;
