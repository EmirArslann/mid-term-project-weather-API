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
                  <div class="weather-icon">
                    <img id="icon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"  alt="${data.weather[0].description}">
                    <p>${data.weather[0].description}</p>
                  </div>  
                  <div class="city-info-box">    
                      <div class="city-info">
                        <p>Temparature : ${data.main.temp} <i class="fa-solid fa-temperature-half"></i></p>
                        <p>Feels like: ${data.main.feels_like} <i class="fa-solid fa-temperature-half"></i> </p>
                      </div>   
                      <div class="city-info">
                        <p>Max : ${data.main.temp_max} <i class="fa-solid fa-temperature-half"></i></p>
                        <p>Min : ${data.main.temp_min} <i class="fa-solid fa-temperature-half"></i></p>
                      </div>
                      <div class="city-info">
                        <p>Wind Degree : ${data.wind.deg} </p>
                        <p>Wind Speed : ${data.wind.speed}
                       </div>     
                  </div>    
                `
              }
              loadData();
              
              setInterval(change_background, 1000 * 60 * 60);

              function change_background() {
                var d = new Date();
                var n = d.getHours();
                console.log(n);
                if (n == 23 || n < 7) {
                  document.body.className = "night";
                }
                if(data.weather[0].description === "broken clouds" && "scattered clouds" && "few clouds" && "overcast clouds"){
                  document.body.className = "broken"
                  
                }
                if(data.weather[0].description === "clear sky"){
                  document.body.className = "clear-sky"

                }if(data.weather[0].main === "rain"){
                  document.body.className = "rain"
                }
                if(document.weather[0].description === "thunderstorm"){
                  document.body.className = "thunder"
                }
                if(document.weather[0].description === "snow"){
                  document.body.className = "snow"
                }
                if(document.weather[0].description === "mist"){
                  document.body.className = "mist"
                }
                else {
                  document.body.className = "day";
                }
                console.log("test");
              }

              change_background();
  
              
            }) 
            .catch(error =>{
                error
            })
        } 

        
        

          

      