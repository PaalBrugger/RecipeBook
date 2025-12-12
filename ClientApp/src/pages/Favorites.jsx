import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/Spinner";
import { LOOKUP_ID_URL } from "../utils/apiUrls";
import RecipeContainer from "../components/RecipeContainer";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setRecipes([]);
        return;
      }
      const fetches = favorites.map((id) =>
        fetch(LOOKUP_ID_URL + id).then((res) => res.json())
      );

      const results = await Promise.all(fetches);
      setRecipes(results);
      setIsLoading(false);
    }

    fetchFavorites();
  }, [favorites]);

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
      <div className="pt-4">
        <RecipeContainer
          recipes={paginatedRecipes}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Favorites;
