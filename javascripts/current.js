import WEATHER_API_KEY from "./api.js";

console.log(WEATHER_API_KEY);
      
      function success(pos) {
        var crd = pos.coords;
      
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        getData(crd.latitude, crd.longitude)
        
    } 
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      const nav = navigator.geolocation.getCurrentPosition(success, error)
      console.log("nav",nav);
      let current = document.getElementById("current-weather")
      function getData(lat, long) {
           return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
              console.log(data)
              console.log(current)
              const loadData=()=>{
                return current.innerHTML = `
                <div class="current-weather-header">
                    <h1 id="name">${data.name}</h1>
                    <i class="fa-solid fa-star"></i>
                  </div>
                  <div class="weather-info">
                  <img id="icon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"  alt="${data.weather[0].description}">
                  <div class="city-info-box">    
                      <div class="city-info">
                        <p>Temparature : ${data.main.temp} <i class="fa-solid fa-temperature-half"></i></p>
                        <p>Feels like: ${data.main.feels_like} <i class="fa-solid fa-temperature-half"></i> </p>
                      </div>   
                      <div class="city-info">
                        <p>Temparature : ${data.main.temp}</p>
                        <p>Feels like : ${data.main.feels_like}</p>
                      </div>
                      <div class="city-info">
                        <p>Wind Degree : ${data.wind.deg} </p>
                        <p>Wind Speed : ${data.wind.speed}
                       </div>     
                  </div>    
                `
              }
              loadData();              
            }) 
            .catch(error =>{
                error
            })
        } 

      