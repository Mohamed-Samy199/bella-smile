const TOKEN_KEY = "bella_token";

export const getToken    = ()       => localStorage.getItem(TOKEN_KEY);
export const setToken    = (token)  => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = ()       => localStorage.removeItem(TOKEN_KEY);

// تنظيف كل البيانات عند الـ logout
export const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.clear();
};