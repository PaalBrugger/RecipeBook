import { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import styles from "./RecipeDetails.module.css";
import {
  LOOKUP_ID_URL,
  ISFAVORITED_RECIPE_URL,
  FAVORITE_RECIPE_URL,
  UNFAVORITE_RECIPE_URL,
} from "../utils/apiUrls";

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(LOOKUP_ID_URL + id);
        const data = await res.json();

        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      }
    }
    fetchRecipe();
  }, [id]);

  // Check if the recipe is favorited
  useEffect(() => {
    async function isFavorited() {
      if (!isAuthenticated) {
        return;
      }
      const res = await fetch(`${ISFAVORITED_RECIPE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log("Failed to fetch favorite status");
        return;
      }
      const data = await res.json();
      setIsFavorite(data.isFavorited);
    }
    isFavorited();
  }, [id]);

  async function toggleFavorite() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isFavorite) {
      const res = await fetch(FAVORITE_RECIPE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (res.ok) {
        setIsFavorite(true);
      }
    }

    if (isFavorite) {
      const res = await fetch(UNFAVORITE_RECIPE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (res.ok) {
        setIsFavorite(false);
      }
    }
  }

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
