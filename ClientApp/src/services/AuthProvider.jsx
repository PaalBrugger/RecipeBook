import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

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
      const data = await res.json();
      throw { message: "Registration failed", backend: data };
    }
  }
  async function checkUsernameAvailability(username) {
    try {
      const res = await fetch("http://localhost:5091/api/auth/check-username", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(username),
      });
      if (res.ok) {
        return { available: true };
      } else if (res.status === 409) {
        const data = await res.json();
        return {
          available: false,
          message: data.message,
        };
      } else {
        console.warn("Unexpected status:", res.status);
        return { available: false, message: "Unexpected error." };
      }
    } catch (error) {
      console.error("Error checking username:");
    }
  }

  async function login(username, password) {
    const res = await fetch("http://localhost:5091/api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("token", data.token);
      setToken(data.token);

      const userData = { username, token: data.token };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      throw new Error("Invalid login");
    }
  }

  async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  }

  const value = {
    token,
    register,
    checkUsernameAvailability,
    login,
    logout,
    user,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
