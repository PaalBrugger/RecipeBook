import { useState, useEffect } from "react";
import { useAuth } from "../services/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validatePassword } from "../utils/helpers";

function Login() {
  const { login, register, checkUsernameAvailability } = useAuth();
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
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [usernameAvailableMessage, setUsernameAvailableMessage] = useState("");

  // Redirect to previous page
  const location = useLocation();
  const from = location.state?.from || "/";

  useEffect(() => {
    document.title = `RecipeBook - Login`;
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(loginUsername, loginPassword);
      toast.success(`Hello ${loginUsername}🌮`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
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
      toast.success("Registration successful!✅");
      await login(regUsername, regPassword);
      navigate("/");
    } catch (error) {
      error.backend.forEach((err) => toast.error(err.description));
    }
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setRegPassword(value);
    setPasswordErrors(validatePassword(value));
  }

  useEffect(() => {
    if (!regUsername) {
      setUsernameAvailableMessage("");
      return;
    }
    const delayDebounce = setTimeout(() => {
      checkUsername(regUsername);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [regUsername]);

  useEffect(() => {
    if (!regPassword) setPasswordErrors([]);
  }, [regPassword]);

  async function checkUsername(username) {
    const result = await checkUsernameAvailability(username);
    if (!result.available) {
      setUsernameAvailableMessage(result.message);
    } else {
      setUsernameAvailableMessage("");
    }
  }

  return (
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

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loginUsername === "" || loginPassword === ""}
          >
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
            onChange={(e) => {
              setRegUsername(e.target.value);
            }}
            onBlur={(e) => checkUsername(e.target.value)}
          />
          {usernameAvailableMessage && (
            <p
              style={{
                color: "red",
                marginTop: "4px",
                marginBottom: "0",
              }}
            >
              {usernameAvailableMessage}
            </p>
          )}
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
            onChange={handlePasswordChange}
          />
          <ul>
            {passwordErrors.map((err, i) => (
              <li key={i} style={{ color: "red" }}>
                {err}
              </li>
            ))}
          </ul>
          <br />
          <br />
          <button
            disabled={
              usernameAvailableMessage !== "" ||
              regUsername === "" ||
              regEmail === "" ||
              regPassword === ""
            }
            type="submit"
            className="btn btn-primary"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
