import RecipeContainer from "../components/RecipeContainer";
import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { RANDOM_URL } from "../utils/apiUrls";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "RecipeBook - Explore Recipes";
  }, []);

  // Fetch random recipes from API
  useEffect(() => {
    async function fetchRecipes() {
      const fetches = Array.from({ length: 4 }, () => fetch(RANDOM_URL));
      const responses = await Promise.all(fetches);
      const meals = await Promise.all(responses.map((res) => res.json()));

      setRecipes(meals);
      setIsLoading(false);
    }

    fetchRecipes();
  }, []);
  return (
    <div>
      <Hero />
      <RecipeContainer recipes={recipes} isLoading={isLoading} />
    </div>
  );
}

export default Home;
