export const saveToken = (token) => {
  localStorage.setItem("HeroItemsAdmin", token);
};

export const getToken = () => {
  return localStorage.getItem("HeroItemsAdmin");
};

export const removeToken = () => {
  localStorage.removeItem("HeroItemsAdmin");
};
