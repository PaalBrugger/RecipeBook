import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import Spinner from "./Spinner";

function RecipeContainer({
  recipes,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (!isLoading && recipes.length === 0)
    return (
      <div>
        <h2>No recipes 😞</h2>
      </div>
    );
  return (
    <div className="container">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="row">
            {recipes.map((recipe, index) => (
              <div className="col-md-3 pb-4" key={index}>
                <Link
                  to={`/Recipe/${recipe.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <RecipeCard recipe={recipe} />
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center pt-4 gap-3">
              <button
                className="btn btn-outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ⬅ Prev
              </button>
              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next ➡
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecipeContainer;
