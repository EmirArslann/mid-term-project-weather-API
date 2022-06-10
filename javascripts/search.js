import * as favCitiesManager from "./favCitiesManager.js";

const domElements = {
  searchEl: () => document.querySelector("#search"),
  selectEl: () => document.querySelector("#favcities"),
  resultEl: () => document.querySelector("#search-result"),
  saveBtnEl: () => document.querySelector("#save-fav"),
};

function initAutoComplete() {
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
    renderResult({
      name: result.name,
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
    });
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

function bindSelectEvent() {
  domElements.selectEl().addEventListener("change", (event) => {
    domElements.searchEl().value = "";
    renderResult(JSON.parse(decodeURI(event.target.value)));
  });
}

function bindSaveFavEvent(city) {
  domElements.saveBtnEl().addEventListener("click", () => {
    if (favCitiesManager.hasCity(city)) {
      favCitiesManager.removeCity(city);
    } else {
      favCitiesManager.addCity(city);
    }
    renderSelect();
    renderResult(city);
  });
}

function renderResult(city) {
  const alreadyFav = favCitiesManager.hasCity(city);
  domElements.resultEl().innerHTML = `
    <h3>${city.name}</h3>
    <p>Lat: ${city.lat}</p>
    <p>Lng: ${city.lng}</p>
    <button type="button" id="save-fav">
      ${alreadyFav ? "Remove Fav" : "Fav"}
    </button>
  `;
  bindSaveFavEvent(city);
}

window.addEventListener("load", () => {
  initAutoComplete();
  bindSelectEvent();
  renderSelect();
});
