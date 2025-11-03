import { useNavigate } from "react-router-dom";

function BackButton({ className, style }) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        className={`btn btn-secondary ${className || ""}`}
        onClick={() => navigate(-1)}
        style={style}
      >
        ⬅ Back
      </button>
    </div>
  );
}

export default BackButton;
