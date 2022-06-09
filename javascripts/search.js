const FAVCITIES_KEY = "favcities";

const renderOption = (displayName, value = "") =>
  `<option value="${encodeURI(value)}">${displayName}</option>`;

const renderOptions = (html, fav) =>
  (html += renderOption(fav.name, JSON.stringify(fav)));

const renderSelect = (selectEl) => {
  const favCities = localStorage.getItem(FAVCITIES_KEY);
  if (!favCities) {
    selectEl.innerHTML = renderOption("No fav city yet");
  } else {
    const optionsHtml = JSON.parse(favCities).reduce(renderOptions, "");
    selectEl.innerHTML = renderOption("Fav cities") + optionsHtml;
  }
};

const bindSaveFavEvent = (cityObj) => {
  const favCities = JSON.parse(localStorage.getItem(FAVCITIES_KEY));
  const btnEl = document.querySelector("#save-fav");
  btnEl.addEventListener("click", () => {
    let newFavCities = [];

    if (favCities.some((c) => c.name === cityObj.name)) {
      newFavCities = favCities.filter((c) => c.name !== cityObj.name);
    } else {
      newFavCities = [...favCities, cityObj];
    }

    localStorage.setItem(FAVCITIES_KEY, JSON.stringify(newFavCities));
    renderSelect(document.querySelector("#favcities"));
    renderResult(document.querySelector("#search-result"), cityObj);
  });
};

const renderResult = (resultEl, cityObj) => {
  const favCities = JSON.parse(localStorage.getItem(FAVCITIES_KEY));
  const alreadyFav = favCities.some((city) => city.name === cityObj.name);
  resultEl.innerHTML = `
    <h3>${cityObj.name}</h3>
    <p>Lat: ${cityObj.lat}</p>
    <p>Lng: ${cityObj.lng}</p>
    <button type="button" id="save-fav">
      ${alreadyFav ? "Remove Fav" : "Fav"}
    </button>
  `;
  bindSaveFavEvent(cityObj);
};

window.addEventListener("load", () => {
  const searchEl = document.querySelector("#search");
  const resultEl = document.querySelector("#search-result");
  const selectEl = document.querySelector("#favcities");

  const options = {
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["(cities)"],
  };
  const autocomplete = new google.maps.places.Autocomplete(searchEl, options);
  autocomplete.addListener("place_changed", () => {
    const result = autocomplete.getPlace();
    renderResult(resultEl, {
      name: result.name,
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
    });
  });

  renderSelect(selectEl);

  selectEl.addEventListener("change", (event) => {
    const payloadObj = JSON.parse(decodeURI(event.target.value));
    renderResult(resultEl, payloadObj);
  });
});
