import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
}

export default BackButton;
