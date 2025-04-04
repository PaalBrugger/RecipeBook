import RecipeContainer from "../components/RecipeContainer";
import Hero from "../components/Hero";
import { useState, useEffect } from "react";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch random recipes from MealDB
  useEffect(() => {
    async function fetchRecipes() {
      const fetches = Array.from({ length: 4 }, () =>
        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      );
      const responses = await Promise.all(fetches);
      const dataArr = await Promise.all(responses.map((res) => res.json()));
      const meals = dataArr.map((data) => data.meals[0]);

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
