document.addEventListener("DOMContentLoaded", function () {
    var loadWeatherBtn = document.getElementById("loadWeatherBtn");
    var icaoCodeInput = document.getElementById("icaoCode");
    var weatherDetailsContainer = document.querySelector(".weather-details");

    loadWeatherBtn.addEventListener("click", function () {
        var icaoCode = icaoCodeInput.value.trim().toUpperCase();

        // Check if the ICAO code is not empty
        if (icaoCode.length === 4) {
            // Make an asynchronous request to the Flask server to fetch weather info
            fetch("/weather/get_weather_info/" + icaoCode)
                .then(response => response.json())
                .then(data => {
                    // Update the weather details on the page
                    updateWeatherDetails(data);
                })
                .catch(error => {
                    console.error("Error fetching weather information:", error);
                });
        } else {
            alert("Please enter a valid ICAO code.");
        }
    });

    function updateWeatherDetails(weatherData) {
        // Clear existing weather details
        var weatherDetailsContainer = document.querySelector(".weather-details");
        var weatherDetailsContainerId = document.getElementById("weather-details-container");
        weatherDetailsContainer.innerHTML = "";
        weatherDetailsContainer.classList.remove("opend");
        weatherDetailsContainer.classList.add("closed");

        // Populate weather details on the page
        for (const [key, value] of Object.entries(weatherData)) {
            var p = document.createElement("p");
            p.innerHTML = `<strong>${key}:</strong> ${value}`;
            p.classList.add("weather_item");
            
            weatherDetailsContainer.appendChild(p);

        }
        var weatherDetailsContainer = document.querySelector(".weather-details");
        setTimeout(function() {
            weatherDetailsContainer.classList.remove("closed");
            weatherDetailsContainer.classList.add("opend");
        }, 1500)
        
    }
});
