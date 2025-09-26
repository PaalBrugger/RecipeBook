import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  async function login(username, password) {
    const res = await fetch("http://localhost:5091/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data, token);
      setUser({ username, token });
    } else {
      throw new Error("Invalid login");
    }
  }
  async function register(
    username,
    email,
    name,
    city,
    country,
    postalCode,
    password
  ) {
    const res = await fetch("http://localhost:5091/api/auth/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        name,
        city,
        country,
        postalCode,
        password,
      }),
    });
    if (!res.ok) {
      throw new Error("Registration failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
  const value = {
    token,
    login,
    register,
    logout,
    user,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
