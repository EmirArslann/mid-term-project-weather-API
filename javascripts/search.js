const makeFavCitiesManager = () => {
  const FAVCITIES_KEY = "favcities";

  const getCities = () => {
    return JSON.parse(localStorage.getItem(FAVCITIES_KEY));
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

  const isEmpty = () => {
    const cities = getCities();
    return !cities || !cities.length;
  };

  return { getCities, saveCities, hasCity, addCity, removeCity, isEmpty };
};

const makeResultManager = (favCitiesManager, selectManager) => {
  const resultEl = document.querySelector("#search-result");
  const btnEl = document.querySelector("#save-fav");

  const bindSaveFavEvent = (city) => {
    btnEl.addEventListener("click", () => {
      if (favCitiesManager.hasCity(city)) {
        favCitiesManager.removeCity(city);
      } else {
        favCitiesManager.addCity(city);
      }
      selectManager.render();
      render();
    });
  };

  const render = (city) => {
    const alreadyFav = favCitiesManager.hasCity(city);
    resultEl.innerHTML = `
      <h3>${city.name}</h3>
      <p>Lat: ${city.lat}</p>
      <p>Lng: ${city.lng}</p>
      <button type="button" id="save-fav">
        ${alreadyFav ? "Remove Fav" : "Fav"}
      </button>
    `;
    bindSaveFavEvent(city);
  };

  return { render };
};

const makeSelectManager = () => {
  const selectEl = document.querySelector("#favcities");

  const bindEvent = () => {
    selectEl.addEventListener("change", (event) => {
      const payloadObj = JSON.parse(decodeURI(event.target.value));
      resultManager.render(payloadObj);
    });
  };

  const renderOption = (displayName, value = "") =>
    `<option value="${encodeURI(value)}">${displayName}</option>`;

  const renderOptions = (html, fav) =>
    (html += renderOption(fav.name, JSON.stringify(fav)));

  const render = () => {
    if (favCitiesManager.isEmpty()) {
      selectEl.innerHTML = renderOption("No fav city yet");
    } else {
      const optionsHtml = favCitiesManager
        .getCities()
        .reduce(renderOptions, "");
      selectEl.innerHTML = renderOption("Fav cities") + optionsHtml;
    }
  };

  return {
    render,
    bindEvent,
  };
};

const makeSearchManager = () => {
  const searchEl = document.querySelector("#search");
  let autocomplete;

  const bindEvent = () => {
    autocomplete.addListener("place_changed", () => {
      const result = autocomplete.getPlace();
      resultManager.render({
        name: result.name,
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      });
    });
  };

  const init = () => {
    autocomplete = new google.maps.places.Autocomplete(searchEl, {
      fields: ["address_components", "geometry", "icon", "name"],
      types: ["(cities)"],
    });
    bindEvent();
  };

  return { init };
};

const searchManager = makeSearchManager();

window.addEventListener("load", () => {
  const favCitiesManager = makeFavCitiesManager();
  const selectManager = makeSelectManager();
  const resultManager = makeResultManager(favCitiesManager, selectManager);

  searchManager.init();
  selectManager.render();
  selectManager.bindEvent();
});
