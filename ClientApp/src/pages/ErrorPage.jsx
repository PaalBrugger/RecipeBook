import { Link, useLocation } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        paddingTop: "6rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1>😵 Oops!</h1>
        <p>Page not found or something went wrong.</p>

        <p style={{ color: "#666" }}>
          Tried to open: <code>{location.pathname}</code>
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
