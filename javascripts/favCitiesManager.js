const FAVCITIES_KEY = "favcities";

const getCities = () => {
  return JSON.parse(localStorage.getItem(FAVCITIES_KEY)) || [];
};

const saveCities = (cities) => {
  localStorage.setItem(FAVCITIES_KEY, JSON.stringify(cities));
};

const hasCity = (city) => {
  return getCities().some((c) => c.name === city.name);
};

const addCity = (city) => {
  saveCities([...getCities(), city]);
};

const removeCity = (city) => {
  saveCities(getCities().filter((c) => c.name !== city.name));
};

export { getCities, saveCities, hasCity, addCity, removeCity };