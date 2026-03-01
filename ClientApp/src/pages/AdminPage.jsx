import BackButton from "../components/BackButton";
import { Link, useNavigate } from "react-router-dom";

function AdminPage() {
  return (
    <div>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />

      <Link to="" className="btn mt-5 w-50 btn-primary">
        Recipes
      </Link>
      <br />
      <Link to="" className="btn mt-3 w-50 btn-primary">
        Users
      </Link>
      <br />
    </div>
  );
}

export default AdminPage;
