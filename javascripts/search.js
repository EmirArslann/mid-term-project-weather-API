import * as favCitiesManager from "./favCitiesManager.js";

const domElements = {
  searchEl: () => document.querySelector("#search"),
  selectEl: () => document.querySelector("#favcities"),
  resultEl: () => document.querySelector("#search-result"),
  saveBtnEl: () => document.querySelector("#save-fav"),
};

function initAutoComplete(currWeatherFn, fiveHourFn) {
  const autocomplete = new google.maps.places.Autocomplete(
    domElements.searchEl(),
    {
      fields: ["address_components", "geometry", "icon", "name"],
      types: ["(cities)"],
    }
  );
  autocomplete.addListener("place_changed", () => {
    const result = autocomplete.getPlace();
    domElements.selectEl().value = "";
    const city = {
      name: result.name,
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
    };
    currWeatherFn(city.lat, city.lng);
    fiveHourFn(city.lat, city.lng);
  });
}

function renderSelect(keepValue) {
  const selectedEl = domElements.selectEl();
  const { value } = selectedEl;

  const renderOption = (displayName, value = "") =>
    `<option value="${encodeURI(value)}">${displayName}</option>`;

  const renderOptions = (html, fav) =>
    (html += renderOption(fav.name, JSON.stringify(fav)));

  if (!favCitiesManager.getCities()) {
    selectedEl.innerHTML = renderOption("No fav city yet");
  } else {
    const optionsHtml = favCitiesManager.getCities().reduce(renderOptions, "");
    selectedEl.innerHTML = renderOption("Fav cities") + optionsHtml;
  }

  if (keepValue) {
    selectedEl.value = value;
  }
}

function bindSelectEvent(currWeatherFn) {
  domElements.selectEl().addEventListener("change", (event) => {
    domElements.searchEl().value = "";
    const city = JSON.parse(decodeURI(event.target.value));
    currWeatherFn(city.lat, city.lng);
    fiveHourFn(city.lat, city.lng);
  });
}

function loadResultAndFavCities(currWeatherFn, fiveHourFn) {
  initAutoComplete(currWeatherFn, fiveHourFn);
  bindSelectEvent(currWeatherFn, fiveHourFn);
  renderSelect();
}

export { loadResultAndFavCities };
