import { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import styles from "./RecipeDetails.module.css";

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useParams();

  const MEAL_URL = "http://localhost:5091/api/recipe/";
  useEffect(() => {
    async function fetchrecipe() {
      try {
        const res = await fetch(MEAL_URL + id);
        const data = await res.json();

        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      }
    }
    fetchrecipe();
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fav) => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(updated.includes(id));
  };

  if (!recipe) return <Spinner />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <BackButton />
        <button
          className={`btn ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? "Favorited ❤️ " : "Add to Favorites 🤍"}
        </button>
      </div>
      <div className={`card p-4 shadow rounded-4 ${styles["card-background"]}`}>
        <div className="row">
          <div className="col-md-5">
            <img
              src={recipe.mainImageUrl}
              alt={recipe.name}
              className="img-fluid rounded-4"
            />
          </div>
          <div className="col-md-7">
            <h2>{recipe.name}</h2>
            <p>
              <strong>Category:</strong> {recipe.category}
              <br />
              <strong>Area:</strong> {recipe.area}
            </p>
            <h4 className="mt-4">Ingredients:</h4>
            <ul className="list-unstyled">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.measure}
                </li>
              ))}
            </ul>
            <h4 className="mt-4">Instructions:</h4>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
