import { BASE_URL } from "../utils/apiUrls";

export function validatePassword(password) {
  const errors = [];
  if (password.length < 6) errors.push("At least 6 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/\d/.test(password)) errors.push("At least one number");
  if (!/[!@#$%^&*]/.test(password))
    errors.push("At least one special character");

  return errors;
}

export function resolveImageUrl(url) {
  if (!url) return "";

  // absolute URL → external image (MealDB)
  if (url.startsWith("http")) return url;

  // relative URL, on disk
  return `${BASE_URL}${url}`;
}
