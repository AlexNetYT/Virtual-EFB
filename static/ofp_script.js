document.addEventListener("DOMContentLoaded", function () {
    var loadOFPBtn = document.getElementById("simbriefLoad");
    var simbriefIdInput = document.getElementById("simbriefId");
    var aircraftTypeSpan = document.getElementById("aircraftType");
    var flightLevelSpan = document.getElementById("flightLevel");
    var showLoadsheetBtn = document.getElementById("loadLoadsheetBtn");
    var loadsheetForm = document.getElementById("loadsheetForm");
    var fixesTableBody = document.querySelector("#fixTable tbody");
    var loadTableBody = document.querySelector("#loadsheetTable tbody");

    // Mock data for demonstration purposes
    var mockOFPData = {
        aircraftType: "B738",
        flightLevel: "FL340",
        fixes: [
            { name: "FIX1", ident: "F1", via: "VIA1", fuelPlanOnboard: "5000", altitude: "34000" },
            // Add more fixes based on your requirements
        ],
        // Add other OFP data here
    };

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
                })
                .catch(error => {
                    console.error("Error fetching OFP information:", error);
                });
        }
    });

    showLoadsheetBtn.addEventListener('click', function() {
        var animatedDiv = document.getElementById('animatedDiv');
    
        // Toggle the 'visible-content' class
        animatedDiv.classList.toggle('visible-content');
    
        // If the class is present, calculate and set the max-height
        if (animatedDiv.classList.contains('visible-content')) {
            animatedDiv.style.width = 'auto';
            setTimeout(function() {
                
                animatedDiv.style.opacity = '1';
                
            },50)
            animatedDiv.style.maxHeight = animatedDiv.scrollHeight + 'px';

        } else {
            animatedDiv.style.maxHeight = '0';
            
            setTimeout(function() {
                animatedDiv.style.opacity = '0';
                animatedDiv.style.width = '0px';
                
            },50)
            
        }
    });
    

    function updateOFPDetails(ofpData) {
        var aircraftTypeSpan = document.getElementById("acType");
        var fields = document.querySelector(".lblspan");
        // var flightLevelSpan = document.getElementById("flightLevel");
        // Update most important flight information
        
        // flightLevelSpan.textContent = ofpData.flightLevel;
        var origin_f = document.getElementById("origin");
        var dest_f = document.getElementById("destination");
        aircraftTypeSpan.textContent = ofpData.aircraftType;
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
