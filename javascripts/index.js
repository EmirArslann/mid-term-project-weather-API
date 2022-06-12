import { loadResultAndFavCities } from "./search.js";
import { getUserLocation, getData } from "./current.js";
import { loadFiveHourData } from "./fivehour.js";

window.addEventListener("load", () => {
  loadResultAndFavCities(getData, loadFiveHourData);
  getUserLocation(loadFiveHourData);
});
