import { useNavigate } from "react-router-dom";

function BackButton({ className, style, buttonText }) {
  const navigate = useNavigate();

  return (
    <div>
      <button
        type="button"
        className={`btn btn-secondary ${className || ""}`}
        onClick={() => navigate(-1)}
        style={style}
      >
        {buttontext ? buttontext : "⬅ Back"}
      </button>
    </div>
  );
}

export default BackButton;
