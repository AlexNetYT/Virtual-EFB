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
        var weatherDetailsContainer = document.querySelector(".weather-details");
        var icaoCode = icaoCodeInput.value.trim().toUpperCase();
        
        // Check if the ICAO code is not empty
        if (icaoCode.length === 4) {
            // Make an asynchronous request to the Flask server to fetch weather info
            fetch("/weather/get_weather_info/" + icaoCode)
                .then(response => response.json())
                .then(data => {
                    // Update the weather details on the page
                    // document.getElementById("metar-text").innerHTML = data['metar-text'];
                    const result = Object.fromEntries(Object.entries(data).slice(2));  
                    updateWeatherDetails(result);
                    
                    updateWind(data['wind-deg']);
                })
                .catch(error => {
                    console.error("Error fetching weather information:", error);
                });
        } else {
            alert("Please enter a valid ICAO code.");
        }
    });
    function updateWind(wind_deg) {
        // let runway = document.getElementById('runway');
        let wind = document.getElementById("compass-arrow");
        document.querySelector('.runway-indicator').classList.add('show_winds');
        setTimeout(function () {
            
            wind.style.transform = "rotate("+wind_deg+"deg)";
        }, 1500)
        
        

    }
    function updateWeatherDetails(weatherData) {
        var weatherDetailsContainerClass = document.querySelector(".weather-details");
        var weatherDetailsContainer = document.getElementById("weather-details-container");
        var separator = document.querySelector('.separator-vertical');
        // Create a document fragment to hold the new elements
        var fragment = document.createDocumentFragment();
    
        // Populate weather details on the fragment
        for (const [key, value] of Object.entries(weatherData)) {
            var p = document.createElement("p");
            p.innerHTML = `<strong>${key}:</strong> ${value}`;
            p.classList.add("weather_item");
            p.style.fontSize = "20px";
            p.style.marginTop = "2%";
            p.style.marginBottom = "2%";
            // Append the paragraph to the fragment
            fragment.appendChild(p);
        }
    
        // Clear existing content and add the fragment to the container
        weatherDetailsContainer.innerHTML = "";
        weatherDetailsContainer.appendChild(fragment);
    
        // Get the new height of the container
        var newHeight = weatherDetailsContainer.scrollHeight;
        
        // Set the initial height
        weatherDetailsContainer.style.height = "0";
    
        // Trigger reflow to apply the initial state before transitioning
        weatherDetailsContainer.offsetHeight;
        
        // Set the actual height with transition
        weatherDetailsContainer.style.height = newHeight + "px";
        
        // Apply class to trigger the transition
        weatherDetailsContainer.classList.add("show");
        
        // Trigger the transition after a short delay
        setTimeout(function () {
            weatherDetailsContainer.classList.remove("closed");
            weatherDetailsContainer.classList.add("opened");
            var newsepHeight = document.querySelector(".weather-container").scrollHeight;
            separator.style.height = newsepHeight-20 + "px";
        console.log("1");
        }, 1000);
    }
    
    
    
        // Trigger the transition after a short delay
    
});