// Base
export const BASE_URL = "http://localhost:5091";
export const API_BASE_URL = "http://localhost:5091/api";

// Auth
export const REGISTER_USER_URL = `${API_BASE_URL}/auth/register`;
export const CHECK_USERNAME_URL = `${API_BASE_URL}/auth/check-username`;
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;

// Recipe
export const FILTER_URL = `${API_BASE_URL}/recipe/filter`;
export const RANDOM_RECIPE_URL = `${API_BASE_URL}/recipe/random-recipe`;
export const RANDOM_RECIPES_URL = `${API_BASE_URL}/recipe/random-recipes`;
export const SEARCH_URL = `${API_BASE_URL}/recipe/search`;
export const LOOKUP_ID_URL = `${API_BASE_URL}/recipe/`;

// User
export const USER_URL = `${API_BASE_URL}/user/me`;
export const FAVORITE_RECIPE_URL = `${API_BASE_URL}/user/favorite-recipe`;
export const UNFAVORITE_RECIPE_URL = `${API_BASE_URL}/user/unfavorite-recipe`;
export const ISFAVORITED_RECIPE_URL = `${API_BASE_URL}/user/is-favorited`;
export const GET_FAVORITED_RECIPES_URL = `${API_BASE_URL}/user/get-favorited-recipes`;
export const CREATE_RECIPE_URL = `${API_BASE_URL}/user/create-recipe`;
export const GET_USER_CREATED_RECIPES_URL = `${API_BASE_URL}/user/get-user-created-recipes`;
export const UPDATE_RECIPE_URL = `${API_BASE_URL}/user/update-recipe`;
export const DELETE_RECIPE_URL = `${API_BASE_URL}/user/delete-recipe`;

// Admin
export const GET_USERS_URL = `${API_BASE_URL}/admin/users`;
export const ADMINISTRATE_USER_URL = `${API_BASE_URL}/admin/user`;
export const ADMIN_UNFAVORITE_RECIPE_URL = `${API_BASE_URL}/admin/unfavorite-recipe`;
