var map = L.map('map').setView([0, 0], 2);
var SyncFlag = 0;
var msfsInterval;
var apscg = '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="210mm" transform="rotate(-45)" height="297mm" viewBox="0 0 210 297" version="1.1" id="svg903" inkscape:version="0.92.4 (5da689c313, 2019-01-14)" sodipodi:docname="airplane.svg"><defs id="defs897"><radialGradient fx="0" fy="0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(2.3466156,0,0,2.3466156,128.09223,197.86853)" spreadMethod="pad" id="radialGradient366"><stop style="stop-opacity:1;stop-color:#fff33b" offset="0" id="stop356" /><stop style="stop-opacity:1;stop-color:#fdc70c" offset="0.2005635" id="stop358" /><stop style="stop-opacity:1;stop-color:#fdc70c" offset="0.423191" id="stop360" /><stop style="stop-opacity:1;stop-color:#f3903f" offset="0.759448" id="stop362" /><stop style="stop-opacity:1;stop-color:#ed683c" offset="1" id="stop364" /></radialGradient><radialGradient fx="0" fy="0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(2.3466243,0,0,2.3466243,120.94676,197.71942)" spreadMethod="pad" id="radialGradient324"><stop style="stop-opacity:1;stop-color:#fff33b" offset="0" id="stop314" /><stop style="stop-opacity:1;stop-color:#fdc70c" offset="0.2005635" id="stop316" /><stop style="stop-opacity:1;stop-color:#fdc70c" offset="0.423191" id="stop318" /><stop style="stop-opacity:1;stop-color:#f3903f" offset="0.759756" id="stop320" /><stop style="stop-opacity:1;stop-color:#ed683c" offset="1" id="stop322" /></radialGradient></defs><sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.4576767" inkscape:cx="332.66676" inkscape:cy="661.68003" inkscape:document-units="mm" inkscape:current-layer="g65-7" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1001" inkscape:window-x="-9" inkscape:window-y="-9" inkscape:window-maximized="1" /><metadata id="metadata900"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"><g style="font-size:12px;fill:#1a1a1a;stroke:#ffffff" id="g65-7" font-size="12" transform="matrix(0.28289579,0,0,0.28289579,94.516679,23.549812)"><path style="fill:#1a1a1a;stroke-width:17.66908836;stroke:none" inkscape:connector-curvature="0" id="path49" d="m 272.11752,251.20854 c 32.20539,-32.2037 -12.33835,-74.30568 -44.13567,-42.50665 l -117.42516,117.42176 -268.99422,-71.10743 -44.84244,44.84414 221.711674,116.76601 -89.668825,89.66883 -69.709809,-8.55884 -35.46539,35.46539 79.086841,41.58244 41.582445,79.08686 35.465399,-35.46728 -8.152467,-69.30155 L 61.238728,459.4334 175.49928,679.69606 220.34172,634.85209 152.26628,371.2999 272.12621,251.21552 Z" /></g></g></svg>';
var icon = L.icon({
  iconUrl: 'data:image/svg+xml,' + encodeURIComponent(apscg), // Embed SVG as a Data URL
    iconSize: [40, 40], // Adjust the size of the icon as needed
    iconAnchor: [6, 6], // Position of the icon anchor relative to the icon center
    popupAnchor: [5, -5] // Position of the popup anchor relative to the icon center
});

var ap_marker = L.marker([0,0], { icon: icon }).addTo(map);
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
  var MSFSButton = document.getElementById("msfs-button");
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
  
  function makeGetRequest() {
    // Выполняем GET-запрос
    fetch("/ofp/get_position/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Обработка полученных данных
        console.log(data);
        var lat = (data.lat);
        var lng = (data.long);
        var newLatLng = new L.LatLng(lat, lng);
        ap_marker.setLatLng(newLatLng); 
        map.setView(newLatLng, 15);
      })
      .catch((error) => {
        // Обработка ошибок
        console.error('Error during fetch:', error.message);
      });
  }
  // Выполняем запрос каждые 5 секунд
  
  MSFSButton.addEventListener("click", function () {
    if (SyncFlag == 0) {
      msfsInterval = setInterval(makeGetRequest, 1000);
      MSFSButton.style.backgroundColor = "#6fc276";
      MSFSButton.style.borderColor = "#6fc276a1";
      SyncFlag = 1;
    } else if (SyncFlag == 1) {
      MSFSButton.style.backgroundColor = "#ffb732";
      MSFSButton.style.borderColor = "#ffb732";
      clearInterval(msfsInterval);
      SyncFlag = 0;
    }
});
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
