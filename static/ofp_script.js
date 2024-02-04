var map = L.map('map').setView([0, 0], 2);
var svgCode = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter id="drop-shadow" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="black" /></filter></defs><polygon points="100,20 180,180 20,180" stroke="#4fa3a3" stroke-width="15" fill="#333333" filter="url(#drop-shadow)" /></svg>'
document.addEventListener("DOMContentLoaded", function () {
  
        
        // Добавление слоя OpenStreetMap
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
          minZoom: 0,
          maxZoom: 20,
          attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          ext: 'png'
        }).addTo(map);
  map.setView([43.446147, 39.942480], 100)
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
    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
      })
    });
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
    var fixesTableBody = document.querySelector(".route-table tbody");

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
    var mh = document.getElementsByClassName("left-block-main")[0].offSetHeight;
    var rt = document.getElementsByClassName("route-table")[0];
    var t = document.getElementsByClassName("table")[0];
    t.style.maxHeight = mh+"px";
    rt.style.maxHeight = mh+"px";
    dist_text.style.fontSize = "20px";
    mach_text.style.fontSize = "20px";
    blockTime.style.fontSize = "20px";
      AirTime.style.fontSize = "20px";
     origin_f.style.fontSize = "20px";
       dest_f.style.fontSize = "20px";
    // Update the list of fixes
    fixesTableBody.innerHTML = "";
    var lineCoordinates = [];
    ofpData.fixes.forEach((fix) => {
      var row = document.createElement("tr");
      var latLng = L.latLng(fix.lat, fix.long);
      lineCoordinates.push(latLng);

      row.innerHTML = `<td>${fix.name}</td>
                             <td>${fix.ident}</td>
                             <td>${fix.via}</td>
                             <td>${fix.fuelPlanOnboard}</td>
                             <td>${fix.altitude}</td>`;
      fixesTableBody.appendChild(row);
      addMarker(fix.lat, fix.long, fix.ident);
    });
    var polyline = L.polyline(lineCoordinates, { color: '#4fa3a3' }).addTo(map);
    map.fitBounds(L.latLngBounds(lineCoordinates));
    map.setZoom(map.getZoom() - 1);

  }
  function addMarker(lat, lng, name) {
    
    var icon = L.icon({
      iconUrl: 'data:image/svg+xml,' + encodeURIComponent(svgCode), // Embed SVG as a Data URL
        iconSize: [20, 20], // Adjust the size of the icon as needed
        iconAnchor: [6, 6], // Position of the icon anchor relative to the icon center
        popupAnchor: [5, -5] // Position of the popup anchor relative to the icon center
    });

    var marker = L.marker([lat, lng], { icon: icon }).addTo(map);

    // You can also add a popup to the marker if needed
    marker.bindPopup(name);

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
