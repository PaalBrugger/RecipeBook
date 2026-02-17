import { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import styles from "./RecipeDetails.module.css";
import { authFetch } from "../utils/authFetch";
import { resolveImageUrl, getEmbedUrl } from "../utils/helpers";
import { toast } from "react-toastify";
import {
  LOOKUP_ID_URL,
  ISFAVORITED_RECIPE_URL,
  FAVORITE_RECIPE_URL,
  UNFAVORITE_RECIPE_URL,
  DELETE_RECIPE_URL,
} from "../utils/apiUrls";

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    document.title = recipe ? `${recipe.name} - RecipeBook` : "RecipeBook";
  }, [recipe]);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(LOOKUP_ID_URL + id);

        if (!res.ok) {
          navigate("/not-found", { replace: true });
          return;
        }

        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        navigate("/not-found", { replace: true });
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
      const res = await authFetch(
        `${ISFAVORITED_RECIPE_URL}/${id}`,
        {},
        logout
      );
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
      // Redirect to login and redirect back after
      navigate("/Login", {
        state: {
          from: `/Recipe/${id}`,
        },
        replace: true,
      });

      return;
    }

    if (!isFavorite) {
      const res = await authFetch(
        FAVORITE_RECIPE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        },
        logout
      );
      if (res.ok) {
        setIsFavorite(true);
      }
    }

    if (isFavorite) {
      const res = await authFetch(
        UNFAVORITE_RECIPE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        },
        logout
      );
      if (res.ok) {
        setIsFavorite(false);
      }
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete your recipe?")) return;

    try {
      const response = await authFetch(
        `${DELETE_RECIPE_URL}?id=${id}`,
        { method: "DELETE" },
        logout
      );
      if (!response.ok) {
        const error = await response.json();
        console.error("Delete failed:", error);
        toast.error("Failed to delete user");
        return;
      }

      toast.success("Recipe Deleted");
      navigate(-1);

      // Catch 401 Unauthorized
    } catch (error) {
      console.log("Request failed:", error.message);
    }
  }

  if (!recipe) return <Spinner />;

  const imageUrl = resolveImageUrl(recipe.mainImageUrl);

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

      {/* Image and YT link */}
      <div className={`card p-4 shadow rounded-4 ${styles["card-background"]}`}>
        <div className="row">
          <div className="col-md-5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={recipe.name}
                className="img-fluid rounded-4"
              />
            ) : null}
            {recipe.youtube && (
              <>
                <p className="pt-2">Youtube:</p>
                <iframe
                  width="420"
                  height="315"
                  src={getEmbedUrl(recipe.youtube)}
                ></iframe>
              </>
            )}
            <br></br>
            {recipe.source && (
              <>
                <p className="pt-5">Source:</p>
                <a href={recipe.source}>{recipe.source}</a>
              </>
            )}
          </div>

          {/* Recipe details */}
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
            <div style={{ whiteSpace: "pre-line" }}>
              <p>{recipe.instructions}</p>
            </div>
            {recipe.userId && (
              <p>
                {/*Link to user*/}
                Recipe by: <Link>{recipe.userName}</Link>
              </p>
            )}
            {recipe.modifiedAt && <p> Modified at: {recipe.modifiedAt}</p>}
          </div>
        </div>

        {isAuthenticated && user.userId === recipe.userId ? (
          <div className="row pt-4 g-3">
            <div className="col-12 col-md-6">
              <Link
                to={`/EditRecipe/${id}`}
                className="btn btn-primary btn-lg w-100 "
              >
                Edit Recipe ✎
              </Link>
            </div>
            <div className="col-12 col-md-6">
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-lg w-100"
              >
                Delete Recipe 🗑️
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RecipeDetails;
