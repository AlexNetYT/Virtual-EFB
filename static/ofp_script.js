var map = L.map("map").setView([0, 0], 2);
var SyncFlag = 0;
var msfsInterval;
var markers = [];
var apscg =
  '<svg width="800px" height="800px" viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" enable-background="new 0 0 76.00 76.00" xml:space="preserve"><path fill="#000000" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 38,27.1542C 43.99,27.1542 48.8458,32.01 48.8458,38C 48.8458,43.99 43.99,48.8458 38,48.8458C 32.01,48.8458 27.1542,43.99 27.1542,38C 27.1542,32.01 32.01,27.1542 38,27.1542 Z M 38,16.625C 49.8051,16.625 59.375,26.1949 59.375,38C 59.375,49.8051 49.8051,59.375 38,59.375C 26.1949,59.375 16.625,49.8051 16.625,38C 16.625,26.1949 26.1949,16.625 38,16.625 Z M 38,20.5833C 28.381,20.5833 20.5833,28.381 20.5833,38C 20.5833,47.619 28.381,55.4167 38,55.4167C 47.6189,55.4167 55.4167,47.619 55.4167,38C 55.4167,28.381 47.619,20.5833 38,20.5833 Z "/></svg>';
var icon = L.icon({
  iconUrl: "data:image/svg+xml," + encodeURIComponent(apscg), // Embed SVG as a Data URL
  iconSize: [40, 40], // Adjust the size of the icon as needed
  iconAnchor: [6, 6], // Position of the icon anchor relative to the icon center
  popupAnchor: [5, -5], // Position of the popup anchor relative to the icon center
});

var ap_marker = L.marker([0, 0], { icon: icon }).addTo(map);
var svgCode =
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter id="drop-shadow" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="black" /></filter></defs><polygon points="100,20 180,180 20,180" stroke="#4fa3a3" stroke-width="15" fill="#333333" filter="url(#drop-shadow)" /></svg>';
document.addEventListener("DOMContentLoaded", function () {
  // Добавление слоя OpenStreetMap
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }).addTo(map);
  map.setView([43.446147, 39.94248], 100);
  var loadOFPBtn = document.getElementById("simbriefLoad");
  var simbriefIdInput = document.getElementById("simbriefIdInput");
  var mach = document.getElementById("flightlevel");
  var bt = document.getElementById("blocktime");
  var fixesTableBody = document.querySelector("#fixTable tbody");
  var dest_weather = document.getElementById("get-arr-weather");
  var dep_weather = document.getElementById("get-dep-weather");
  var loadTableBody = document.querySelector("#loadsheetTable tbody");
  var MSFSButton = document.getElementById("msfs-button");
  var msfs_file = document.getElementById("file-input");
  const closeBtn = document.getElementById("closeModal");
  closeBtn.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("open");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  });
  simbriefIdInput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      loadOFPBtn.click();
    }
  });
  function clearMap() {
    // Удаляем каждый маркер из карты
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);
    map.setView([43.446147, 39.94248], 100);
    document.getElementById("dist_text").innerHTML = "";
    document.getElementById("mach").innerHTML = "";
    document.getElementById("origin").innerHTML = "";
    document.getElementById("dest").innerHTML = "";
    document.getElementById("dep_time").innerHTML = "";
    document.getElementById("arr_time").innerHTML = "";

    document.getElementById("block_txt").innerHTML = "";
    document.getElementById("enroute_txt").innerHTML = "";
    document.getElementById("pax_txt").innerHTML = "";
    document.getElementById("payload_txt").innerHTML = "";
    document.getElementById("zfw_txt").innerHTML = "";
    document.getElementById("tow_txt").innerHTML = "";
    document.querySelector(".route-table tbody").innerHTML = "";
    var layersToRemove = [];

    map.eachLayer(function (layer) {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        layersToRemove.push(layer);
      }
    });

    layersToRemove.forEach(function (layer) {
      map.removeLayer(layer);
    });

    // Очищаем массив маркеров
    markers = [];
  }
  function riseModal(title, body) {
    var error_body = document.getElementById("error-text");
    var error_title = document.getElementById("error-title");
    error_title.innerHTML = title;
    error_body.innerHTML = body;
    modal.style.display = "flex";

    setTimeout(() => {
      modal.classList.add("open");
    }, 300);
  }
  loadOFPBtn.addEventListener("click", function () {
    // Mock API call to fetch OFP data based on SimBrief ID
    var simbriefId = simbriefIdInput.value.trim();

    const modal = document.getElementById("modal");
    clearMap();
    var loadOFPBtn = document.getElementById("simbriefLoad");
    if (simbriefId !== "") {
      // Replace this with actual API endpoint for OFP data
      fetch("/ofp/get_ofp_info/" + simbriefId)
        .then((response) => {
          if (!response.ok) {
            riseModal("Something went wrong!","Server returned error")
            loadOFPBtn.style.backgroundColor = "#dc143c";
            loadOFPBtn.style.borderColor = "#dc143c";
            loadOFPBtn.style.color = "white";
            setTimeout(function () {
              loadOFPBtn.style.backgroundColor = "#ffb732";
              loadOFPBtn.style.borderColor = "#ffb732";
              loadOFPBtn.style.color = "black";
            }, 1500);
            throw new Error(
              `Network response was not ok, status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          if (data.status != "OK") {
            riseModal(data.status.split("|")[0],data.status.split("|")[1])
          } else {
            // Update the page with OFP data
            updateOFPDetails(data);
            // updateLoadsheet(data);

            let map = data.map;
            let vertprof = data.vertprof;
            let pdf = data.pdf;
            bt.innerHTML = data.blockTime;
            fl.innerHTML = data.flightLevel;
            // document.getElementById('ofpld').onclick = function() {changeIframe(pdf)};
          }
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
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2,
      }),
    });
  });
  function changeIframe(url) {
    let view = document.getElementById("map");
    view.src = url;
  }

  msfs_file.addEventListener("change", handleFiles, false);
  function handleFiles() {
    const formData = new FormData();
    var files = document.getElementById("msfs_file");
    formData.append("file", this.files[0]);
    const requestOptions = {
      headers: {
        "Content-Type": this.files[0].contentType, // This way, the Content-Type value in the header will always match the content type of the file
      },
      mode: "no-cors",
      method: "POST",
      files: this.files[0],
      body: formData,
    };
    console.log(requestOptions);

    fetch("/ofp/upload", requestOptions).then((response) => {
      ofpData = response.json();
      var dist_text = document.getElementById("dist_text");
      var mach_text = document.getElementById("mach");
      var origin_f = document.getElementById("origin");
      var dest_f = document.getElementById("dest");
      var blockTime = document.getElementById("dep_time");
      var AirTime = document.getElementById("arr_time");

      var block = document.getElementById("block_txt");
      var entroute = document.getElementById("enroute_txt");
      var pax = document.getElementById("pax_txt");
      var payload = document.getElementById("payload_txt");
      var zfw = document.getElementById("zfw_txt");
      var tow = document.getElementById("tow_txt");
      var fixesTableBody = document.querySelector(".route-table tbody");

      origin_f.textContent = ofpData.origin;
      dest_f.textContent = ofpData.destination;

      var mh = document.getElementsByClassName("left-block-main")[0]
        .offSetHeight;
      var rt = document.getElementsByClassName("route-table")[0];
      var t = document.getElementsByClassName("table")[0];
      t.style.maxHeight = mh + "px";
      rt.style.maxHeight = mh + "px";
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
                                   <td></td>
                                   <td></td>`;
        fixesTableBody.appendChild(row);
        addMarker(fix.lat, fix.long, fix.text);
      });
      var polyline = L.polyline(lineCoordinates, { color: "#4fa3a3" }).addTo(
        map
      );
      map.fitBounds(L.latLngBounds(lineCoordinates));
      map.setZoom(map.getZoom() - 1);
    });
  }
  function makeGetRequest() {
    var MSFSButton = document.getElementById("msfs-button");
    // Выполняем GET-запрос
    fetch("/ofp/get_position/")
      .then((response) => {
        if (!response.ok) {
          MSFSButton.style.backgroundColor = "#dc143c";
          MSFSButton.style.borderColor = "#dc143c";
          MSFSButton.style.color = "white";
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        MSFSButton.style.backgroundColor = "#6fc276";
        MSFSButton.style.borderColor = "#6fc276a1";
        MSFSButton.style.color = "black";
        return response.json();
      })
      .then((data) => {
        // Обработка полученных данных
        console.log(data);
        var lat = data.lat;
        var lng = data.long;
        var newLatLng = new L.LatLng(lat, lng);
        ap_marker.setLatLng(newLatLng);

        // map.setView(newLatLng, 15);
      })
      .catch((error) => {
        // Обработка ошибок
        console.error("Error during fetch:", error.message);
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
      clearInterval(msfsInterval);
      MSFSButton.style.backgroundColor = "#ffb732";
      MSFSButton.style.borderColor = "#ffb732";
      MSFSButton.style.color = "black";

      SyncFlag = 0;
    }
  });

  dest_weather.addEventListener("click", function () {
    var icao = document.getElementById("dest");
    if (icao.innerHTML != "ICAO") {
      a = new URL(window.location.origin + "/weather?ICAO=" + icao.innerHTML);
      window.location = a;
    }
  });
  dep_weather.addEventListener("click", function () {
    var icao = document.getElementById("origin");
    if (icao.innerHTML != "ICAO") {
      a = new URL(window.location.origin + "/weather?ICAO=" + icao.innerHTML);
      window.location = a;
    }
  });
  function updateOFPDetails(ofpData) {
    var dist_text = document.getElementById("dist_text");
    var mach_text = document.getElementById("mach");
    var origin_f = document.getElementById("origin");
    var dest_f = document.getElementById("dest");
    var blockTime = document.getElementById("dep_time");
    var AirTime = document.getElementById("arr_time");

    var block = document.getElementById("block_txt");
    var entroute = document.getElementById("enroute_txt");
    var pax = document.getElementById("pax_txt");
    var payload = document.getElementById("payload_txt");
    var zfw = document.getElementById("zfw_txt");
    var tow = document.getElementById("tow_txt");
    var fixesTableHead = document.querySelector(".route-table thead tr");
    
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
    t.style.maxHeight = mh + "px";
    rt.style.maxHeight = mh + "px";
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
      addMarker(fix.lat, fix.long, fix.text);
    });
    fixesTableHead.style['box-shadow'] = "0px 10px 8px -8px #ffea97";
    var polyline = L.polyline(lineCoordinates, { color: "#4fa3a3" }).addTo(map);
    map.fitBounds(L.latLngBounds(lineCoordinates));
    map.setZoom(map.getZoom() - 1);
  }
  function addMarker(lat, lng, name) {
    var icon = L.icon({
      iconUrl: "data:image/svg+xml," + encodeURIComponent(svgCode), // Embed SVG as a Data URL
      iconSize: [20, 20], // Adjust the size of the icon as needed
      iconAnchor: [6, 6], // Position of the icon anchor relative to the icon center
      popupAnchor: [5, -5], // Position of the popup anchor relative to the icon center
    });

    var marker = L.marker([lat, lng], { icon: icon }).addTo(map);

    // You can also add a popup to the marker if needed
    marker.bindPopup(name);
    markers.push(marker);
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
