import { useEffect } from "react";
import { useState } from "react";

function RecipeDetails({ recipe }) {
  return (
    <div className={`card h-100 w-100 rounded-4`}>
      <div className="card-body">
        <img
          src={recipe.strMealThumb}
          className="img-fluid rounded-4"
          alt="Recipe"
        ></img>
        <h3 className="pt-3">{recipe.strMeal}</h3>
      </div>
    </div>
  );
}

export default RecipeDetails;
