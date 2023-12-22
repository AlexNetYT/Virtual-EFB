document.addEventListener("DOMContentLoaded", function () {
    var loadWeatherBtn = document.getElementById("loadWeatherBtn");
    var icaoCodeInput = document.getElementById("icaoCode");
    var weatherDetailsContainer = document.querySelector(".weather-details");
    icaoCodeInput.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          loadWeatherBtn.click();
        }
      });
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
        var weatherDetailsContainer = document.querySelector(".weather-details");
        var weatherDetailsContainerId = document.getElementById("weather-details-container");
        weatherDetailsContainer.innerHTML = "";
        weatherDetailsContainer.classList.remove("opend");
        weatherDetailsContainer.classList.add("closed");
    
        // Populate weather details on the page
        for (const [key, value] of Object.entries(weatherData)) {
            var p = document.createElement("p");
            // var dib = document.createElement("div");
            p.innerHTML = `<strong>${key}:</strong> ${value}`;
            p.classList.add("weather_item");
            // dib.innerHTML = `<div style="
            //     width: 100%;
            //     height: 5px;
            //     background: #1f1f1f69;
            //     border-radius: 189px;
            // "></div>`;
    
            weatherDetailsContainer.appendChild(p);
            // weatherDetailsContainer.appendChild(dib);
    
            // Trigger reflow to apply the initial state before transitioning
            p.offsetHeight;
            // dib.offsetHeight;
    
            // Apply class to trigger the transition
            p.classList.add("show");
            // dib.classList.add("show");
        }
    
        // Trigger the transition after a short delay
        setTimeout(function () {
            weatherDetailsContainer.classList.remove("closed");
            weatherDetailsContainer.classList.add("opend");
        }, 1000);
    }
    
});
