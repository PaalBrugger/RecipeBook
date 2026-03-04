import BackButton from "../components/BackButton";
import { useAuth } from "../services/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { authFetch } from "../utils/authFetch";
import { ADMINISTRATE_USER_URL } from "../utils/apiUrls";

function ManageUser() {
  const { logout } = useAuth();
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);

  // Load user data
  useEffect(() => {
    authFetch(`${ADMINISTRATE_USER_URL}/${id}`, {}, logout)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsername(data.userName);
        setEmail(data.email);
        setName(data.name);
        setCity(data.city);
        setCountry(data.country);
        setPostalCode(data.postalCode);
        setFavoritedRecipes(data.favoritedRecipes);
        setCreatedRecipes(data.createdRecipes);
      });
  }, []);

  // Update user data
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await authFetch(
        `${ADMINISTRATE_USER_URL}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            name,
            city,
            country,
            postalCode,
          }),
        },
        logout
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Update failed:", data);
        return;
      }
      toast.success(`Changes saved 💾`);

      // Catch 401 Unauthorized
    } catch (error) {
      console.log("Request failed:", error.message);
      toast.error("Unauthorized");
    }
  }

  return (
    <>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />

      <h2 className="mb-4">Edit profile</h2>

      <div className="container mt-4">
        <div className="row">
          {/*User details */}
          <div className="col-6">
            <form
              onSubmit={handleSubmit}
              className="mx-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="mb-3">
                <label className="form-label">Id:</label>
                <input
                  type="text"
                  className="form-control"
                  value={id}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">City:</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Country:</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Postal Code:</label>
                <input
                  type="text"
                  className="form-control"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">PhoneNumber:</label>
                <input
                  type="text"
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Save Changes 💾
              </button>
              <button type="button" className="btn btn-danger w-100 mt-3">
                Delete User
              </button>
            </form>
          </div>

          {/*Recipes */}
          <div className="col-6">
            {/*Created Recipes */}
            <h3>Created Recipes</h3>
            {createdRecipes.length === 0 ? (
              <p>No created recipes</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {createdRecipes.map((r) => (
                  <div key={r.id} className="border p-4 rounded shadow">
                    <h3>{r.name}</h3>
                    <p>{r.category}</p>
                    <div className="flex gap-2">
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/*Favorited Recipes */}
            <h3>Favorited Recipes</h3>
            {favoritedRecipes.length === 0 ? (
              <p> No favorited recipes</p>
            ) : (
              <table className="min-w-full table-auto border">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>User</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/*Favorited Recipes */}
                  {favoritedRecipes.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.category}</td>
                      <td>{r.userName}</td>
                      <td>
                        <button>Edit</button>
                        <button>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageUser;
