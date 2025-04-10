import { Routes, Route } from "react-router-dom";
import "./App.css";
import RecipeContainer from "./components/RecipeContainer";
import Home from "./pages/Home.jsx";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="Recipes" element={<Recipes />} />
        <Route path="Login" element={<Login />} />
        <Route path="Favorites" element={<Favorites />} />
        <Route path="Recipe/:id" element={<RecipeDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
