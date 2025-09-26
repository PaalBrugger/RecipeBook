import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";
import Recipes from "./pages/Recipes";
import { AuthProvider } from "./services/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./pages/Edituser";
import User from "./pages/User";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="Recipes" element={<Recipes />} />
          <Route path="Recipe/:id" element={<RecipeDetails />} />
          <Route path="Favorites" element={<Favorites />} />
          <Route path="Login" element={<Login />} />
          <Route
            path="User"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="EditUser"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={1500} />
    </AuthProvider>
  );
}

export default App;
