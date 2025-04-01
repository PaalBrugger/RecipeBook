import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/Spinner";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const MEAL_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const fetches = favorites.map((id) =>
        fetch(MEAL_URL + id)
          .then((res) => res.json())
          .then((data) => data.meals[0])
      );

      const results = await Promise.all(fetches);
      setRecipes(results);
      setLoading(false);
    }

    fetchFavorites();
  }, [favorites]);

  if (loading) {
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
            <div className="col-md-3 mb-4" key={recipe.idMeal}>
              <Link
                to={`/recipe/${recipe.idMeal}`}
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
