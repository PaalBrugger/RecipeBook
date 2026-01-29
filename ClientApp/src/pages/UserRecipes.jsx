import { useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import RecipeContainer from "../components/RecipeContainer";

function UserRecipes() {
  useEffect(() => {}, []);

  return (
    <div>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />
      <h1>My Recipes 🥧</h1>

      <Link to="/CreateRecipe" className="btn mt-5 mb-5 btn-primary">
        Create Recipe
      </Link>
      <RecipeContainer recipes={[]} />
    </div>
  );
}

export default UserRecipes;
