import { useState, useEffect, useRef } from "react";
import RecipeContainer from "../components/RecipeContainer";

function Recipes() {
  const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?";
  const RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedArea, setSelectedArea] = useState("Select Area");
  const [dropdownOpenCategory, setDropdownOpenCategory] = useState(false);
  const [dropdownOpenArea, setDropdownOpenArea] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryRef = useRef(null);
  const areaRef = useRef(null);
  const dropdownRef = useRef(null);

  const categories = [
    "All",
    "Beef",
    "Breakfast",
    "Chicken",
    "Dessert",
    "Goat",
    "Lamb",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
    "Miscellaneous",
  ];
  const areas = [
    "All",
    "American",
    "British",
    "Canadian",
    "Chinese",
    "Croatian",
    "Dutch",
    "Egyptian",
    "French",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Jamaican",
    "Japanese",
    "Kenyan",
    "Malaysian",
    "Mexican",
    "Moroccan",
    "Polish",
    "Portugese",
    "Russian",
    "Spanish",
    "Thai",
    "Tunisian",
    "Turkish",
    "Ukrainian",
    "Uruguayan",
    "Vietnamese",
  ];

  // Filter by category and area
  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true);
      let meals = [];

      const isDefaultCategory =
        selectedCategory === "Select Category" || selectedCategory === "All";
      const isDefaultArea =
        selectedArea === "Select Area" || selectedArea === "All";
      try {
        if (!isDefaultCategory) {
          const res = await fetch(`${API_URL}c=${selectedCategory}`);
          const data = await res.json();
          meals = data.meals || [];
        } else if (!isDefaultArea) {
          const res = await fetch(`${API_URL}a=${selectedArea}`);
          const data = await res.json();
          meals = data.meals || [];
        } else {
          const fetches = Array.from({ length: 20 }, () =>
            fetch("https://www.themealdb.com/api/json/v1/1/random.php")
          );
          const responses = await Promise.all(fetches);
          const dataArr = await Promise.all(responses.map((res) => res.json()));
          meals = dataArr.map((data) => data.meals[0]);

          setRecipes(meals);
          setIsLoading(false);
          return;
        }
        // If both filters are selected, do extra filtering
        if (!isDefaultCategory && !isDefaultArea) {
          const detailedFetches = meals.map((meal) =>
            fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            )
              .then((res) => res.json())
              .then((data) => data.meals[0])
          );
          const detailedMeals = await Promise.all(detailedFetches);

          meals = detailedMeals.filter((meal) => meal.strArea === selectedArea);
        }

        setRecipes(meals);
        setIsLoading(false);
      } catch (error) {
        console.log("Failed to fetch");
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    }
    console.log(searchTerm);
    fetchRecipes();
  }, [selectedArea, selectedCategory, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="container mt-4">
        <div className="row align-items-center g-2">
          {/* Category Dropdown */}
          <div className="col-md-4">
            <div className="position-relative" ref={categoryRef}>
              <button
                className="btn btn-warning w-100"
                onClick={() => setDropdownOpenCategory(!dropdownOpenCategory)}
              >
                {selectedCategory}
              </button>
              {dropdownOpenCategory && (
                <ul
                  className="list-group position-absolute w-100 list-unstyled"
                  style={{ zIndex: 1000 }}
                >
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setDropdownOpenCategory(false);
                        }}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Area Dropdown */}
          <div className="col-md-4">
            <div className="position-relative" ref={areaRef}>
              <button
                className="btn btn-info w-100"
                onClick={() => setDropdownOpenArea(!dropdownOpenArea)}
              >
                {selectedArea}
              </button>
              {dropdownOpenArea && (
                <ul
                  className="list-group position-absolute w-100 list-unstyled"
                  style={{ zIndex: 1000 }}
                >
                  {areas.map((area) => (
                    <li key={area}>
                      <button
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setSelectedArea(area);
                          setDropdownOpenArea(false);
                        }}
                      >
                        {area}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Recipes */}
      <div className="pt-4">
        <RecipeContainer recipes={recipes} isLoading={isLoading} />
      </div>
    </div>
  );
}
export default Recipes;
