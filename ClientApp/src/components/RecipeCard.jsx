import styles from "./RecipeCard.module.css";

function RecipeCard({ recipe }) {
  return (
    <div
      className={`card h-100 w-100 rounded-4 ${styles["card-background"]} ${styles["recipe-card"]}`}
    >
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

export default RecipeCard;
