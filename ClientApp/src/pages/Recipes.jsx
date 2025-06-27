import { useState, useEffect, useRef } from "react";
import { areas, categories } from "../utils/dropdownOptions";
import RecipeContainer from "../components/RecipeContainer";

function Recipes() {
  const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?";
  const RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
  const SEARCH_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  const [selectedCategory, setSelectedCategory] = useState("Select Category");
  const [selectedArea, setSelectedArea] = useState("Select Area");
  const [dropdownOpenCategory, setDropdownOpenCategory] = useState(false);
  const [dropdownOpenArea, setDropdownOpenArea] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryRef = useRef(null);
  const areaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 12;
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const paginatedRecipes = recipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

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
        if (searchTerm !== "") {
          const res = await fetch(`${SEARCH_URL}${searchTerm}`);
          console.log(res);
          const data = await res.json();
          console.log(data);
          meals = data.meals || [];
          return;
        }

        if (!isDefaultCategory) {
          const res = await fetch(`${API_URL}c=${selectedCategory}`);
          const data = await res.json();
          meals = data.meals || [];
        } else if (!isDefaultArea) {
          const res = await fetch(`${API_URL}a=${selectedArea}`);
          const data = await res.json();
          meals = data.meals || [];
        } else if (searchTerm === "") {
          const fetches = Array.from({ length: 36 }, () => fetch(RANDOM_URL));
          const responses = await Promise.all(fetches);
          const dataArr = await Promise.all(responses.map((res) => res.json()));
          meals = dataArr.map((data) => data.meals[0]);

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
      } catch (error) {
        console.log("Failed to fetch");
        setRecipes([]);
      } finally {
        setRecipes(meals);
        setIsLoading(false);
      }
    }
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
                          setSearchInput("");
                          setSearchTerm("");
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
                          setSearchInput("");
                          setSearchTerm("");
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
          <div className="col-md-4 d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSelectedArea("Select Area");
                  setSelectedCategory("Select Category");
                  setSearchTerm(searchInput);
                }
              }}
            />
            {/* Clear search button */}

            {searchInput && (
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Recipes */}
      <div className="pt-4">
        <RecipeContainer
          recipes={paginatedRecipes}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
export default Recipes;
