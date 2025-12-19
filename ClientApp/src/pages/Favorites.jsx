import { useEffect, useState } from "react";
import { GET_FAVORITED_RECIPES } from "../utils/apiUrls";
import { useAuth } from "../services/AuthProvider";
import RecipeContainer from "../components/RecipeContainer";

function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch(GET_FAVORITED_RECIPES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch favorite status");
      }
      const data = await res.json();
      setRecipes(data);
      setIsLoading(false);
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
