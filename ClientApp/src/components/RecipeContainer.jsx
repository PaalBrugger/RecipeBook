import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import Spinner from "./Spinner";

function RecipeContainer() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch random recipes from MealDB
  useEffect(() => {
    async function fetchRecipes() {
      const fetches = Array.from({ length: 4 }, () =>
        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      );
      const responses = await Promise.all(fetches);
      const dataArr = await Promise.all(responses.map((res) => res.json()));
      const meals = dataArr.map((data) => data.meals[0]);

      setRecipes(meals);
      setLoading(false);
    }

    fetchRecipes();
  }, []);

  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <div className="row">
          {recipes.map((recipe, index) => (
            <div className="col-md-3 pb-4" key={index}>
              <Link
                to={`/recipe/${recipe.idMeal}`}
                style={{ textDecoration: "none" }}
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

export default RecipeContainer;
