import { resolveImageUrl } from "../utils/helpers";
import styles from "./RecipeCard.module.css";

function RecipeCard({ recipe }) {
  const imageUrl = resolveImageUrl(recipe.mainImageUrl);

  return (
    <div
      className={`card h-100 w-100 rounded-4 ${styles["card-background"]} ${styles["recipe-card"]}`}
    >
      <div className="card-body">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="img-fluid rounded-4"
            alt="Recipe"
          ></img>
        ) : null}

        <h3 className="pt-3">{recipe.name}</h3>
      </div>
    </div>
  );
}

export default RecipeCard;
