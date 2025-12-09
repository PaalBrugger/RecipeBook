import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { areas, categories } from "../utils/dropdownOptions";
import RecipeContainer from "../components/RecipeContainer";

function Recipes() {
  const FILTER_URL = "http://localhost:5091/api/recipe/filter";
  const RANDOM_URL = "http://localhost:5091/api/recipe/random";
  const SEARCH_URL = "http://localhost:5091/api/recipe/search?searchTerm=";

  const [params, setParams] = useSearchParams();

  const category = params.get("category") || "Select Category";
  const area = params.get("area") || "Select Area";
  const search = params.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedArea, setSelectedArea] = useState(area);
  const [searchInput, setSearchInput] = useState(search);
  const [searchTerm, setSearchTerm] = useState(search);

  const [dropdownOpenCategory, setDropdownOpenCategory] = useState(false);
  const [dropdownOpenArea, setDropdownOpenArea] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryRef = useRef(null);
  const areaRef = useRef(null);

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
          const data = await res.json();
          meals = data || [];
        } else {
          if (!isDefaultCategory) {
            const res = await fetch(
              `${FILTER_URL}?category=${selectedCategory}`
            );
            const data = await res.json();
            meals = data || [];
          } else if (!isDefaultArea) {
            const res = await fetch(`${FILTER_URL}?area=${selectedArea}`);
            const data = await res.json();
            meals = data || [];
          } else if (searchTerm === "") {
            const fetches = Array.from({ length: 36 }, () => fetch(RANDOM_URL));
            const responses = await Promise.all(fetches);
            const dataArr = await Promise.all(
              responses.map((res) => res.json())
            );
            meals = dataArr.map((data) => data);
          }
          // If both filters are selected, do extra filtering
          if (!isDefaultCategory && !isDefaultArea) {
            const res = await fetch(
              `${FILTER_URL}?category=${selectedCategory}&area=${selectedArea}`
            );
            const data = await res.json();
            meals = data || [];
          }
        }
      } catch (error) {
        console.log("Failed to fetch", error);
        setRecipes([]);
      } finally {
        setRecipes(meals);
        setIsLoading(false);
      }
    }
    fetchRecipes();
  }, [selectedArea, selectedCategory, searchTerm]);

  // Sync internal state with URL
  useEffect(() => {
    setSelectedCategory(category);
    setSelectedArea(area);
    setSearchInput(search);
    setSearchTerm(search);
  }, [category, area, search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setDropdownOpenCategory(false);
      }

      if (areaRef.current && !areaRef.current.contains(event.target)) {
        setDropdownOpenArea(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateURL(newValues) {
    const newParams = new URLSearchParams(params);

    Object.entries(newValues).forEach(([key, value]) => {
      if (
        !value ||
        value === "Select Category" ||
        value === "Select Area" ||
        value === "All"
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setParams(newParams);
  }

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
                          updateURL({
                            category: cat,
                            area: selectedArea,
                            search: null,
                          });
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
                          updateURL({
                            category: selectedCategory,
                            area: area,
                            search: null,
                          });
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
                  updateURL({
                    category: null,
                    area: null,
                    search: searchInput,
                  });
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
                  updateURL({
                    category: null,
                    area: null,
                    search: null,
                  });
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
