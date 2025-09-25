import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={`title ${styles.header}`}>
      <nav className="navbar navbar-dark bg-transparent px-4 p-5">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/">
            <img
              src="/src/assets/RecipeBookLogo.png"
              alt="RecipeBook"
              style={{ width: "110px", height: "110px", marginRight: "12px" }}
            />
          </Link>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <span className={styles["glow-title"]}>RecipeBook</span>
          </Link>
        </div>
        <div className="d-flex gap-4">
          <Link to="Recipes" className={styles["btn-glow-blue"]}>
            Recipes
          </Link>
          <Link to="Favorites" className={styles["btn-glow-blue"]}>
            Favorites
          </Link>

          <Link to="Login" className={styles["btn-glow-orange"]}>
            {isAuthenticated ? user.username : "Login"}
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
