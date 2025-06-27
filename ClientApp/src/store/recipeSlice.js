import { createSlice } from "@reduxjs/toolkit";

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    list: [],
  },
  reducers: {
    addRecipe: (state, action) => {
      state.list.push(action.payload);
    },
    clearRecipes: (state) => {
      state.list = [];
    },
  },
});
export const { addRecipe, clearRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;
