import WEATHER_API_KEY from "./api.js";
import * as favCitiesManager from "./favCitiesManager.js";

function getUserLocation(loadFiveHourData) {
  const success = (pos) => {
    var crd = pos.coords;
    getData(crd.latitude, crd.longitude);
    loadFiveHourData(crd.latitude, crd.longitude);
  };

  const error = () => {
    getData(49.246292, -123.116226);
    loadFiveHourData(49.246292, -123.116226);
  };

  navigator.geolocation.getCurrentPosition(success, error);
}

function getData(lat, long) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => loadData(data));
}

function change_background(data) {
  var d = new Date();
  var n = d.getHours();
  if (n == 23 || n < 7) {
    document.body.className = "night";
  }
  if (
    data.weather[0].description === "broken clouds" ||
    data.weather[0].description === "scattered clouds" ||
    data.weather[0].description === "few clouds" ||
    data.weather[0].description === "overcast clouds"
  ) {
    document.body.className = "broken";
    return;
  }
  if (data.weather[0].description === "clear sky") {
    document.body.className = "clear-sky";
    return;
  }
  if (data.weather[0].main === "rain") {
    document.body.className = "rain";
    return;
  }
  if (data.weather[0].description === "thunderstorm") {
    document.body.className = "thunder";
    return;
  }
  if (data.weather[0].description === "snow") {
    document.body.className = "snow";
    return;
  }
  if (data.weather[0].description === "mist") {
    document.body.className = "mist";
    return;
  }

  document.body.className = "day";
}

function renderSelect(keepValue) {
  const selectedEl = document.querySelector("#favcities");
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

function bindSaveFavEvent(city, data) {
  document.querySelector("#save-fav").addEventListener("click", () => {
    if (favCitiesManager.hasCity(city)) {
      favCitiesManager.removeCity(city);
    } else {
      favCitiesManager.addCity(city);
    }
    renderSelect();
    loadData(data);
  });
}

function loadData(data) {
  const current = document.getElementById("current-weather");

  const alreadyFav = favCitiesManager.hasCity(data);

  current.innerHTML = `
    <div class="current-weather-header">
      <h1 id="name">${data.name}</h1>
      <button
        type="button"
        id="save-fav"
        class="save-fav-btn"
        title="${alreadyFav ? "Remove from favorites" : "Add to favorites"}"
      >
        <i class="fa-${alreadyFav ? "solid" : "regular"} fa-star"></i>
      </button>
    </div>
    <div class="weather-info">
      <div class="weather-icon">
        <img id="icon" src="https://openweathermap.org/img/w/${
          data.weather[0].icon
        }.png"  alt="${data.weather[0].description}">
        <p>${data.weather[0].description}</p>
      </div>  
      <div class="city-info-box">    
        <div class="city-info">
          <p>Temparature : ${
            data.main.temp
          } <i class="fa-solid fa-temperature-half"></i></p>
          <p>Feels like: ${
            data.main.feels_like
          } <i class="fa-solid fa-temperature-half"></i> </p>
        </div>   
        <div class="city-info">
          <p>Max : ${
            data.main.temp_max
          } <i class="fa-solid fa-temperature-half"></i></p>
          <p>Min : ${
            data.main.temp_min
          } <i class="fa-solid fa-temperature-half"></i></p>
        </div>
        <div class="city-info">
          <p>Wind Degree : ${data.wind.deg} </p>
          <p>Wind Speed : ${data.wind.speed}
        </div>     
      </div>
    </div>
  `;

  setInterval(() => change_background(data), 1000 * 60 * 60);
  change_background(data);
  bindSaveFavEvent(
    {
      name: data.name,
      lat: data.coord.lat,
      lng: data.coord.lon,
    },
    data
  );
}

export { getUserLocation, getData };
