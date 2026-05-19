export const getSessionUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getSessionToken = () => {
  return localStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!getSessionToken();
};

export const logoutSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};