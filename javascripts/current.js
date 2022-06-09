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
      
      function getData(lat , long) {
           return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`)
            .then(response => response.json())
            .then(data => {
              console.log(data)
              let currentHtml = data
              this.infotxt = ""
              for(let i = 0; i < currentHtml.length; i++){
                const info = currentHtml[i]
                
                const infoHtml = `
                <H1>Current Weather</H1>
                <div class="current-weather">
                    <div class="current-weather-header">
                        <h2 id="name">${info.name}</h2>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="weather-info">
                        <img src="" alt="">
            
                    </div>
                </div>
                `;
                
              }
            }) 
            .catch(error =>{
                error

            })
        } 

      