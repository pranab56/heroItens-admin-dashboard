export const saveToken = (token) => {
  localStorage.setItem("HeroItemsAdmin", token);
  setCookie("HeroItemsAdmin", token);
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem("HeroItemsAdmin");
  if (token) return token;

  // Fallback to cookie if localStorage is empty
  const name = "HeroItemsAdmin=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
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
