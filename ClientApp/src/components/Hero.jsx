import styles from "./Hero.module.css";
function Hero() {
  return (
    <div className={styles["hero-wrapper"]}>
      <div className={styles["hero-content"]}>
        <h1>Your Culinary Adventure Starts Here</h1>
        <p>Your destination for magical meals and celestial flavors.</p>
        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-warning">Recipes</button>
          <button className="btn btn-info">Areas</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
