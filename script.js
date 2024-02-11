const apiKey = "6d618859ee1bca60237c11fbce3184ca";

// Retrieve search history from local storage or initialize an empty array if not present
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function displayCurrentWeather(data, city) {
  const weatherInfo = document.getElementById("weatherInfo");
  const weather = data.weather[0];
  const tempFahrenheit = convertKelvinToFahrenheit(data.main.temp);
  const feelsLikeFahrenheit = convertKelvinToFahrenheit(data.main.feels_like);

  weatherInfo.innerHTML = `
    <h2>${city}<img src="http://openweathermap.org/img/wn/${
    weather.icon
  }.png" alt="Weather Icon"></h2>
    <p>Date: ${getCurrentDate()}</p>
    <p>Temperature: ${tempFahrenheit.toFixed(2)}°F</p>
    <p>Feels Like: ${feelsLikeFahrenheit.toFixed(2)}°F</p>
    <p>Wind: ${data.wind.speed} mph</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Weather: ${weather.main}</p>
  `;
}
// Display 5-day forecast as styled cards with temperatures converted to Fahrenheit
function displayFiveDayForecast(fiveDayForecast) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML =
    '<h2 class="mt-4 text-center">5-Day Forecast</h2>';

  fiveDayForecast.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const weather = entry.weather[0];
    const tempFahrenheit = convertKelvinToFahrenheit(entry.main.temp);

    forecastContainer.innerHTML += `
    <div class="col-2 forecast-card border rounded p-3">
        <p>Date: ${date.toDateString()}</p>
        <p>Temperature: ${tempFahrenheit.toFixed(2)}°F</p>
        <p>Wind: ${entry.wind.speed} mph</p>
        <p>Humidity: ${entry.main.humidity}%</p>
        <p>Weather: ${weather.main}</p>
        <img src="https://openweathermap.org/img/wn/${
          weather.icon
        }.png" alt="Weather Icon">
      </div>
    `;
  });
}

function getCurrentDate() {
  const currentDate = new Date();
  return currentDate.toDateString();
}

function convertKelvinToFahrenheit(tempKelvin) {
  return ((tempKelvin - 273.15) * 9) / 5 + 32;
}

function createCityButton(city) {
  const cityList = document.getElementById("savedSearches");
  if (
    Array.from(cityList.children).some((button) => button.textContent === city)
  ) {
    console.warn("Button for this city already exists.");
    return;
  }

  const cityButton = document.createElement("button");
  cityButton.className = "btn btn-secondary w-100 my-2";
  cityButton.textContent = city;
  cityButton.type = "button";
  cityButton.addEventListener("click", () => {
    fetchWeatherData(city);
  });

  cityList.appendChild(cityButton);
}
//Fetch weather data from API and calling displayCurrentWeather and displayFiveDayForecast
function fetchWeatherData(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      displayCurrentWeather(data, city);
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      const fiveDayForecast = data.list.filter(
        (entry) => new Date(entry.dt_txt).getHours() === 12
      );
      displayFiveDayForecast(fiveDayForecast);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

document
  .getElementById("weatherForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (city && !searchHistory.includes(city)) {
      searchHistory.push(city);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); // Update local storage
      createCityButton(city);
    }
    fetchWeatherData(city);
  });

//City buttons from local storage
searchHistory.forEach((city) => {
  createCityButton(city);
});
