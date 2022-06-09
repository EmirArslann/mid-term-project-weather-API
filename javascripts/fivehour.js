import config from "./api.js";

console.log(config.WEATHER_API_KEY);





fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=49.246292&lon=-123.116226&units=metric&appid=${config.WEATHER_API_KEY}`)
.then(response => response.json())
.then(data => {
    function groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
          let key = obj[property].split(' ')[0]
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(obj)
          return acc
        }, {})
      };
      let fivedays = groupBy(data.list, 'dt_txt');
      
      Object.entries(fivedays).forEach(([date, element]) => {
        let avetemp = 0;
        element.forEach(element => {
            avetemp += element.main.temp
        
        });
          let showave = avetemp/8;
        let fdays = document.querySelector('.daily')
        fdays.innerHTML +=`
        <div class="daily-box">
        <h3>${date}</h3>
        <p>${showave}</p>
        </div>
        `
      
        console.log(avetemp)
        console.log(showave)
      });

     
    // 3 Hours Range
    let dates = data.list.filter(datetxt => {
        return   datetxt.dt_txt.startsWith('2022-06-10')
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
   // Daily Ave Temp
    // let avetemp = 0;
    // let hourlength = dates.length
    // dates.forEach((element) => avetemp += element.main.temp);
    // let showave = avetemp/hourlength;

    console.log(fivedays);
    console.log(dates)
    console.log(data)
});

