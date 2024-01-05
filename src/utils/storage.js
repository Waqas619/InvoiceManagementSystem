export const getItem = (key) => {
  const data = localStorage.getItem(key);
  const result = JSON.parse(data);
  return result;
};

export const setItem = (key, data) => {
  return localStorage.setItem(key, JSON.stringify(data));
};

export const removeItem = (key) => {
  return localStorage.removeItem(key);
};

export const clearStorage = () => {
  return localStorage.clear();
};
