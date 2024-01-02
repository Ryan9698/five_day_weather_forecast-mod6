const apiKey = '6d618859ee1bca60237c11fbce3184ca';

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
  
    // Fetch coordinates using Geocoding API
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        // Lat and Lon from API response
        const { lat, lon } = data[0];
  
        // Fetch weather forecast using coordinates from the Geocoding API
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        // Variables for converting Kelvin API response to Fahrenheit
        console.log(data);
        const tempKelvin = data.list[0].main.temp;
        const feelsLikeKelvin = data.list[0].main.feels_like
        const feelsLikeFahrenheit = (feelsLikeKelvin - 273.15) * 9/5 + 32;
        const tempFahrenheit = (tempKelvin - 273.15) * 9/5 + 32;
        const weatherInfo = document.getElementById('weatherInfo');
        const weather = data.list[0].weather[0]; // Accessing the first entry in the 'weather' array

        // InnerHTML changes after city name is supplied (may change later)
        weatherInfo.innerHTML = `
          <h5>City: ${city}</h5>
          <h6>Temp: ${tempFahrenheit.toFixed(2)}°F</h6>
          <h6>Feels Like: ${feelsLikeFahrenheit.toFixed(2)}°F</h6>
          <h6>Wind: ${data.list[0].wind.speed} mph</h6>
          <h6>Humidity: ${data.list[0].main.humidity}%</h6>
          <h6>Weather: ${weather.main}</h6>
          <img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather Icon">
        `;
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  });

