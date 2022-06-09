import config from "./api.js";

console.log(config.WEATHER_API_KEY);



fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=49.246292&lon=-123.116226&units=metric&appid=${config.WEATHER_API_KEY}`)
.then(response => response.json())
.then(data => {
    let dates = data.list.filter(datetxt => {
        return   datetxt.dt_txt.startsWith('2022-06-09')
    })
  let thour = document.querySelector('.hour')
    dates.forEach(element => {
        var iconurl = "http://openweathermap.org/img/w/" + element.weather[0].icon + ".png";
        thour.innerHTML += `
        <div class="hour-box">
        <h3>${element.dt_txt.split(' ').pop()}</h3>
        <p>${element.main.feels_like}°C</p>
        <p>H:${element.main.temp_max}</p>
        <p>L:${element.main.temp_min}</p>
        <p>${element.weather[0].description}</p>
        <img src="${iconurl}" alt="">
        </div>
        `
    });

    

    console.log(dates)
    console.log(data)
});

