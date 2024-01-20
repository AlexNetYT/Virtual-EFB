document.addEventListener("DOMContentLoaded", function () {
  var loadOFPBtn = document.getElementById("simbriefLoad");
  var simbriefIdInput = document.getElementById("simbriefIdInput");
  var mach = document.getElementById("flightlevel");
  var bt = document.getElementById("blocktime");
  var fixesTableBody = document.querySelector("#fixTable tbody");
  var loadTableBody = document.querySelector("#loadsheetTable tbody");
  simbriefIdInput.addEventListener("keypress", function (event) {
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
        .then((response) => response.json())
        .then((data) => {
          // Update the page with OFP data
          updateOFPDetails(data);
          // updateLoadsheet(data);

          let map = data.map;
          let vertprof = data.vertprof;
          let pdf = data.pdf;
          bt.innerHTML = data.blockTime;
          fl.innerHTML = data.flightLevel;
          document.getElementById("map").src = map;
          document.getElementById("rtld").onclick = function () {
            changeIframe(map);
          };
          document.getElementById("vpld").onclick = function () {
            changeIframe(vertprof);
          };
          // document.getElementById('ofpld').onclick = function() {changeIframe(pdf)};
        })
        .catch((error) => {
          loadOFPBtn.classList.add("animat-sbbd");
          setTimeout(function () {
            loadOFPBtn.classList.remove("animat-sbbd");
          }, 1500);
          console.error("Error fetching OFP information:", error);
        });
    }
  });

  function changeIframe(url) {
    let view = document.getElementById("map");
    view.src = url;
  }

  function updateOFPDetails(ofpData) {
    var dist_text = document.getElementById("dist_text");
    var mach_text = document.getElementById("mach");
    var origin_f = document.getElementById("origin");
    var dest_f = document.getElementById("depart");
    var blockTime = document.getElementById("dep_time");
    var AirTime = document.getElementById("arr_time");

    var block = document.getElementById("block_txt");
    var entroute = document.getElementById("enroute_txt");
    var pax = document.getElementById("pax_txt");
    var payload = document.getElementById("payload_txt");
    var zfw = document.getElementById("zfw_txt");
    var tow = document.getElementById("tow_txt");

    dist_text.textContent = ofpData.distance;
    mach_text.textContent = ofpData.mach;
    blockTime.textContent = ofpData.arr_time;
    AirTime.textContent = ofpData.dep_time;
    origin_f.textContent = ofpData.origin;
    dest_f.textContent = ofpData.destination;

    block.textContent = ofpData.loadsheet.block;
    entroute.textContent = ofpData.loadsheet.enroute;
    pax.textContent = ofpData.loadsheet.pax;
    payload.textContent = ofpData.loadsheet.payload;
    zfw.textContent = ofpData.loadsheet.zfw;
    tow.textContent = ofpData.loadsheet.tow;

    dist_text.style.fontSize = "20px";
    mach_text.style.fontSize = "20px";
    blockTime.style.fontSize = "20px";
      AirTime.style.fontSize = "20px";
     origin_f.style.fontSize = "20px";
       dest_f.style.fontSize = "20px";
    // Update the list of fixes
    fixesTableBody.innerHTML = "";
    ofpData.fixes.forEach((fix) => {
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
