import { loadResultAndFavCities } from "./search.js";
import { getUserLocation, getData } from "./current.js";

window.addEventListener("load", () => {
  loadResultAndFavCities(getData);
  getUserLocation();
});
