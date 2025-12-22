export async function authFetch(url, options = {}, onUnauthorized) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    if (onUnauthorized) onUnauthorized();
    throw new Error("Unauthorized");
  }

  return res;
}
