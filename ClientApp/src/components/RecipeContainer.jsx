import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import Spinner from "./Spinner";

function RecipeContainer({ recipes, isLoading }) {
  if (!isLoading && recipes.length === 0)
    return (
      <div>
        <h2>No recipes 😞</h2>
      </div>
    );
  return (
    <div className="container">
      {isLoading ? (
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
