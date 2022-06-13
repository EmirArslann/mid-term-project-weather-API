import WEATHER_API_KEY from "./api.js";

function loadFiveHourData(lat, lng) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      function groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
          let key = obj[property].split(" ")[0];
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});
      }
      let fivedays = groupBy(data.list, "dt_txt");

      Object.entries(fivedays).forEach(([date, element]) => {
        let avetemp = 0;
        element.forEach((element) => {
          avetemp += element.main.temp;
        });
        let showave = avetemp / element.length;
        let fdays = document.querySelector(".daily");
        fdays.innerHTML += `
          <div class="daily-box card" name='${date}' >
          <h3>${date}</h3>
          <p>${showave}</p>
          </div>
          `;
        // console.log(fdays);
      });
      let hourrange = document.querySelectorAll(".daily-box");
      hourrange.forEach((element) => {
        element.addEventListener("click", () => {
          render3hoursRange(element, fivedays);
        });
      });
      render3hoursRange(hourrange[0], fivedays);
    });
}

function render3hoursRange(element, fivedays) {
  const name = element.getAttribute("name");
  fivedays[name];
  let thour = document.querySelector(".hour");
  thour.innerHTML = "";
  fivedays[name].forEach((element) => {
    var iconurl =
      "http://openweathermap.org/img/w/" + element.weather[0].icon + ".png";
    thour.innerHTML += `
    <div class="hour-box card">
    <h3>${element.dt_txt.split(" ").pop()}</h3>
    <p>${element.main.feels_like}°C</p>
    <p>H:${element.main.temp_max}</p>
    <p>L:${element.main.temp_min}</p>
    <p>${element.weather[0].description}</p>
    <img src="${iconurl}" alt="">
    </div>
    `;
  });
}

export { loadFiveHourData };
