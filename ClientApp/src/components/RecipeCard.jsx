import styles from "./RecipeCard.module.css";
import { useState, useEffect } from "react";

function RecipeCard({ recipe }) {
  return (
    <div
      className={`card h-100 w-100 rounded-4 ${styles["card-background"]} ${styles["recipe-card"]}`}
    >
      {recipe ? (
        <div className="card-body">
          <img
            src={recipe.strMealThumb}
            className="img-fluid rounded-4"
            alt="Recipe"
          ></img>
          <h3 className="pt-3">{recipe.strMeal}</h3>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RecipeCard;
