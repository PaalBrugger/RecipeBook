import { useState } from "react";
import { useAuth } from "../services/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const { login, register, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regCountry, setRegCountry] = useState("");
  const [regPostalCode, setRegPostalCode] = useState("");
  const [regPassword, setRegPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(loginUsername, loginPassword);
      toast.success(`Hello ${loginUsername}🌮`);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
    }
  }
  async function handleRegister(e) {
    e.preventDefault();

    try {
      await register(
        regUsername,
        regEmail,
        regName,
        regCity,
        regCountry,
        regPostalCode,
        regPassword
      );
      toast.success("Registration successful! Please log in");
    } catch (err) {
      toast.error(err.message);
    }
  }
  async function handleLogout(e) {
    e.preventDefault();
    try {
      await logout();
      toast.info("Logged out");
    } catch (err) {
      alert(err.message);
    }
  }
  return !isAuthenticated ? (
    <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
      {/* Login box */}
      <div
        style={{ border: "1px solid #ccc", padding: "1rem", width: "250px" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            autoComplete="username"
          />
          <br />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            autoComplete="current-password"
          />
          <br />
          <br />

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>

      {/* Register box */}
      <div
        style={{ border: "1px solid #ccc", padding: "1rem", width: "250px" }}
      >
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
          />
          <br />
          <br />

          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="Name"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />
          <br />
          <br />

          <input
            type="text"
            placeholder="Country"
            value={regCountry}
            onChange={(e) => setRegCountry(e.target.value)}
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="City"
            value={regCity}
            onChange={(e) => setRegCity(e.target.value)}
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="PostalCode"
            value={regPostalCode}
            onChange={(e) => setRegPostalCode(e.target.value)}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <br />
          <br />

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  ) : (
    <form onSubmit={handleLogout}>
      <button type="submit" onSubmit={handleLogout} className="btn btn-primary">
        Signout
      </button>
    </form>
  );
}

export default Login;
