// Base
export const BASE_URL = "http://localhost:5091";
export const API_BASE_URL = "http://localhost:5091/api";

// Recipe
export const FILTER_URL = `${API_BASE_URL}/recipe/filter`;
export const RANDOM_URL = `${API_BASE_URL}/recipe/random`;
export const SEARCH_URL = `${API_BASE_URL}/recipe/search`;
export const LOOKUP_ID_URL = `${API_BASE_URL}/recipe/`;

// User

export const FAVORITE_RECIPE_URL = `${API_BASE_URL}/user/favorite-recipe`;
export const UNFAVORITE_RECIPE_URL = `${API_BASE_URL}/user/unfavorite-recipe`;
export const ISFAVORITED_RECIPE_URL = `${API_BASE_URL}/user/is-favorited`;
export const GET_FAVORITED_RECIPES_URL = `${API_BASE_URL}/user/get-favorited-recipes`;

export const USER_URL = `${API_BASE_URL}/user/me`;

export const CREATE_RECIPE_URL = `${API_BASE_URL}/user/create-recipe`;
export const GET_USER_CREATED_RECIPES_URL = `${API_BASE_URL}/user/get-user-created-recipes`;
export const UPDATE_RECIPE_URL = `${API_BASE_URL}/user/update-recipe`;
export const DELETE_RECIPE_URL = `${API_BASE_URL}/user/delete-recipe`;
