import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";

const store = configureStore({
  reducer: { recipeReducer },
});

export default store;
