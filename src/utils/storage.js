export const saveToken = (token) => {
  localStorage.setItem("HeroItemsAdmin", token);
  setCookie("HeroItemsAdmin", token);
};

export const getToken = () => {
  return localStorage.getItem("HeroItemsAdmin");
};

export const removeToken = () => {
  localStorage.removeItem("HeroItemsAdmin");
  deleteCookie("HeroItemsAdmin");
};

const setCookie = (name, value, days = 7) => {
  if (typeof document !== 'undefined') {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }
}

const deleteCookie = (name) => {
  if (typeof document !== 'undefined') {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
}
