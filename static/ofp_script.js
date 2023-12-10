document.addEventListener("DOMContentLoaded", function () {
    var loadOFPBtn = document.getElementById("simbriefLoad");
    var simbriefIdInput = document.getElementById("simbriefId");
    var aircraftTypeSpan = document.getElementById("aircraftType");
    var flightLevelSpan = document.getElementById("flightLevel");
    var showLoadsheetBtn = document.getElementById("loadLoadsheetBtn");
    var loadsheetForm = document.getElementById("loadsheetForm");
    var fixesTableBody = document.querySelector("#fixTable tbody");

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
                })
                .catch(error => {
                    console.error("Error fetching OFP information:", error);
                });
        }
    });

    showLoadsheetBtn.addEventListener("click", function () {
        // Show the loadsheet form
        loadsheetForm.style.display = "block";
    });

    function updateOFPDetails(ofpData) {
        var aircraftTypeSpan = document.getElementById("acType");
        var fields = document.querySelector(".lblspan");
        // var flightLevelSpan = document.getElementById("flightLevel");
        // Update most important flight information
        aircraftTypeSpan.textContent = ofpData.aircraftType;
        // flightLevelSpan.textContent = ofpData.flightLevel;
        setTimeout(function () {
            fields.style.display = "block";
            fields.style.width = "50%";
        }, 500)
        
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
            var row_add = document.createElement("tr");
            // row_add.innerHTML = `<td><div style="background: #ffb732; width=100%; height:5px; border-top-left-radius:10px; border-bottom-left-radius:10px;"></div></td>
            //                     <td><div style="background: #ffb732; width=100%; height:5px;"></div></td>
            //                     <td><div style="background: #ffb732; width=100%; height:5px;"></div></td>
            //                     <td><div style="background: #ffb732; width=100%; height:5px;"></div></td>
            //                     <td><div style="background: #ffb732; width=100%; height:5px; border-top-right-radius:10px; border-bottom-right-radius:10px;"></div></td>`;
            // fixesTableBody.appendChild(row_add);
        });
    }
});
