import { useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import RecipeContainer from "../components/RecipeContainer";
import { authFetch } from "../utils/authFetch";
import { GET_USER_CREATED_RECIPES_URL } from "../utils/apiUrls";
import { useAuth } from "../services/AuthProvider";
import { useState } from "react";
import { toast } from "react-toastify";

function UserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    document.title = `RecipeBook - My Recipes`;
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await authFetch(GET_USER_CREATED_RECIPES_URL, {}, logout);
        const data = await res.json();
        setRecipes(data);
        setIsLoading(false);

        // Catch 401 Unauthorized
      } catch (error) {
        console.log("Request failed:", error.message);
        toast.error("Unauthorized");
      }
    }
    fetchRecipes();
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const paginatedRecipes = recipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  return (
    <div>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />
      <h1>My Recipes 🥧</h1>

      <Link to="/CreateRecipe" className="btn mt-5 mb-5 btn-primary">
        Create Recipe
      </Link>
      <RecipeContainer
        recipes={paginatedRecipes}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default UserRecipes;
