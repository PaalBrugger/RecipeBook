import BackButton from "../components/BackButton";
import { useAuth } from "../services/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EditUser() {
  const { token, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const oldUsernameRef = useRef("");

  const navigate = useNavigate();

  // Load user data
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5091/api/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        oldUsernameRef.current = data.userName;
        setUsername(data.userName);
        setEmail(data.email);
        setName(data.name);
        setCity(data.city);
        setCountry(data.country);
        setPostalCode(data.postalCode);
      });
  }, [token]);

  // Update user data
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:5091/api/user/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
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
    });

    if (!response.ok) {
      console.error("Update failed");
      throw new Error("Failed to update user");
    }
    toast.success(`Changes saved 💾`);

    if (oldUsernameRef.current !== username) {
      await logout();
      toast.info("Logged out");
      navigate("/");
    } else {
      navigate(-1);
    }
    return await response.json();
  }

  return (
    <>
      <BackButton className="position-absolute start-0 mt-3 ms-5" />

      <h2 className="mb-4">Edit profile</h2>

      <div className="container mt-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto"
          style={{ maxWidth: "600px" }}
        >
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

          <button type="submit" className="btn btn-primary w-100">
            Save Changes 💾
          </button>
        </form>
      </div>
    </>
  );
}

export default EditUser;
