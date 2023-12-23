document.addEventListener("DOMContentLoaded", function () {
    // Get the element where you want to display the time
    var timeDisplay = document.getElementById("timeDisplay");
    var timeDisplay_utc = document.getElementById("timeutcDisplay");
    var welcomeOverlay = document.querySelector(".welcome-overlay");
    // Function to update the time
    async function updateTime() {
        try {
            // Fetch the current time from the server or another source
            var response = await fetch("/get_current_time"); // Replace with your server endpoint
            var currentTime = await response.json(); // Assuming the server returns time in JSON format
            var response_utc = await fetch("/get_current_time_utc"); // Replace with your server endpoint
            var currentTime_utc = await response_utc.json(); // Assuming the server returns time in JSON format
            // Update the time display
            timeDisplay.innerText = currentTime;
            timeDisplay_utc.innerText = currentTime_utc;
        } catch (error) {
            console.error("Error updating time:", error);
        }
    }

    // Initial call to set the time immediately
    updateTime();
    setTimeout(function () {
        welcomeOverlay.style.opacity = "0";
      }, 900);
      setTimeout(function () {
        welcomeOverlay.style.display = "none"; // Change display to flex
      }, 2700);
      // ... your existing code ...
    // Set up an interval to update the time every minute
    setInterval(updateTime, 1000); // 60000 milliseconds = 1 minute
});
