document.addEventListener("DOMContentLoaded", function () {
    var loadOFPBtn = document.getElementById("simbriefLoad");
    var simbriefIdInput = document.getElementById("simbriefId");
    var aircraftTypeSpan = document.getElementById("aircraftType");
    var fl = document.getElementById("flightlevel");
    var bt = document.getElementById("blocktime");
    var fixesTableBody = document.querySelector("#fixTable tbody");
    var loadTableBody = document.querySelector("#loadsheetTable tbody");
    simbriefIdInput.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          loadOFPBtn.click();
        }
      });
    loadOFPBtn.addEventListener("click", function () {
        // Mock API call to fetch OFP data based on SimBrief ID
        var simbriefId = simbriefIdInput.value.trim();
        if (simbriefId !== "") {
            // Replace this with actual API endpoint for OFP data
            fetch("/ofp/get_ofp_info/" + simbriefId)
                .then(response => response.json())
                .then(data => {
                    // Update the page with OFP data
                    updateOFPDetails(data);
                    updateLoadsheet(data);
                    
                    loadOFPBtn.classList.add("animat-sbgd");
                    setTimeout(function () {
                        loadOFPBtn.classList.remove("animat-sbgd");
                    }, 1500)
                    setTimeout(function () {
                        showPopups();
                    }, 250)
                    let map = data.map;
                    let vertprof = data.vertprof;
                    let pdf = data.pdf;
                    bt.innerHTML = data.blockTime;
                    fl.innerHTML = data.flightLevel;
                    document.getElementById('map').src = map;
                    document.getElementById('rtld').onclick = function() {changeIframe(map)};
                    document.getElementById('vpld').onclick = function() {changeIframe(vertprof)};
                    // document.getElementById('ofpld').onclick = function() {changeIframe(pdf)};
                })
                .catch(error => {
                    loadOFPBtn.classList.add("animat-sbbd");
                    setTimeout(function () {
                        loadOFPBtn.classList.remove("animat-sbbd");
                    }, 1500)
                    console.error("Error fetching OFP information:", error);
                });
        }
    });


    function changeIframe(url) {
        let view = document.getElementById('map');
        view.src = url;
    }
    function showPopups(){
        var animatedDiv = document.getElementById('animatedDiv');
        var mapDiv = document.getElementById('map-container');
        var ofpDiv = document.getElementById('ofp-container');

        
        // Toggle the 'visible-content' class
        mapDiv.classList.toggle('visible-content');
        animatedDiv.classList.toggle('visible-content');
        // If the class is present, calculate and set the max-height
        if (animatedDiv.classList.contains('visible-content')) {
            animatedDiv.style.width = 'auto';
            mapDiv.style.width = '35%';
            ofpDiv.style.paddingRight = '5%';
            setTimeout(function() {
                animatedDiv.style.opacity = '1';
                mapDiv.style.opacity = '1';
            },50)
            animatedDiv.style.maxHeight = animatedDiv.scrollHeight + 'px';
            // mapDiv.style.maxHeight = mapDiv.scrollHeight + 'px';
        } else {
            animatedDiv.style.maxHeight = '0';
            // mapDiv.style.maxHeight = '0';
            setTimeout(function() {
                animatedDiv.style.opacity = '0';
                animatedDiv.style.width = '0px';
                mapDiv.style.opacity = '0';
                mapDiv.style.width = '0px';
            },50)
            
        }
    }


    function updateOFPDetails(ofpData) {
        var aircraftTypeSpan = document.getElementById("acType");
        var fields = document.querySelector(".lblspan");
        // var flightLevelSpan = document.getElementById("flightLevel");
        // Update most important flight information
        
        // flightLevelSpan.textContent = ofpData.flightLevel;
        var origin_f = document.getElementById("origin");
        var dest_f = document.getElementById("destination");
        aircraftTypeSpan.textContent = ofpData.callsign;
        origin_f.textContent = ofpData.origin;
        dest_f.textContent = ofpData.destination;
        // Update the list of fixes
        fixesTableBody.innerHTML = "";
        ofpData.fixes.forEach(fix => {
            var row = document.createElement("tr");
            row.innerHTML = `<td>${fix.name}</td>
                             <td>${fix.ident}</td>
                             <td>${fix.via}</td>
                             <td>${fix.fuelPlanOnboard}</td>
                             <td>${fix.altitude}</td>`;
            fixesTableBody.appendChild(row);
        });
        
    }
    function updateLoadsheet(ofpData) {
        loadTableBody.innerHTML = "";
            var row = document.createElement("tr");
            row.innerHTML = `<td>${ofpData.loadsheet.block}</td>
                             <td>${ofpData.loadsheet.enroute}</td>
                             <td>${ofpData.loadsheet.pax}</td>
                             <td>${ofpData.loadsheet.payload}</td>
                             <td>${ofpData.loadsheet.zfw}</td>
                             <td>${ofpData.loadsheet.tow}</td>`;
            loadTableBody.appendChild(row);
        
        
    }
    
});
