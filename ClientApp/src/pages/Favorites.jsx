import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/Spinner";
import { LOOKUP_ID_URL } from "../utils/apiUrls";

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
        setIsLoading(false);
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Favorite Recipes 🍽️</h2>
      {recipes.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div className="col-md-3 mb-4" key={recipe.id}>
              <Link
                to={`/recipe/${recipe.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <RecipeCard recipe={recipe} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
