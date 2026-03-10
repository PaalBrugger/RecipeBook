import { useEffect } from "react";
import BackButton from "../components/BackButton";
import { authFetch } from "../utils/authFetch";
import { useAuth } from "../services/AuthProvider";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { GET_USERS_URL } from "../utils/apiUrls";

function ManageUsers() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    authFetch(GET_USERS_URL, {}, logout)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />
      <h1>Manage Users</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-6 mt-4">
              <div className="input-group gap-3 ">
                <input
                  type="text"
                  className=" form-control"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearch("");
                  }}
                />
                {search !== "" && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearch("");
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-3">
            {filteredUsers.map((user) => (
              <div className="col-12 col-md-6 col-lg-4 mb-3 mt-3" key={user.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{user.userName}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>

                    <Link
                      to={`/ManageUser/${user.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
