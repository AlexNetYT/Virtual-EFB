document.addEventListener("DOMContentLoaded", function () {
  var pdfFrame = document.getElementById("pdf-frame");
  var pdfButtons = document.querySelectorAll(".pdf-button");
  var menuButtons = document.querySelectorAll(".menu-button");
  var welcomeOverlay = document.querySelector(".welcome-overlay");
  var maxCodeInput = document.getElementById("icaoInput");
  var loadPdfBtn = document.getElementById("loadPdfBtn");
  var pdfListContainer = document.getElementById("pdfList");
  var redownloadPdfBtn = document.getElementById("redownloadPdfBtn");
  var loadingOverlay = document.querySelector(".loading-overlay");

  function filterPdfsByTag(tag, icao) {
    // Fetch the PDF files for the specified tag from the server
    fetch("/get_pdfs_by_tag/" + tag + "/" + icao)
      .then((response) => response.json())
      .then((data) => {
        // Clear existing PDF list
        pdfListContainer.innerHTML = "";

        // Populate PDF list with buttons for each PDF file
        data.pdf_files.forEach((pdfFile) => {
          var li = document.createElement("li");
          var button = document.createElement("button");
          button.className = "pdf-button";
          button.setAttribute("data-pdf", pdfFile);
          let text = pdfFile;
          text = text.substring(0, text.length - 6); // Remove the last character
          button.textContent = text;
          li.appendChild(button);
          pdfListContainer.appendChild(li);
        });

        // Update event listeners for the new buttons
        updatePdfButtonListeners();
      })
      .catch((error) => {
        console.error("Error fetching PDF files:", error);
      });
  }

  function showLoadingOverlay() {
    var leftpart = document.querySelector(".pdf-list");
    var iframe = document.getElementById("pdf-frame");
    var icaoInputValue = maxCodeInput.value.trim().toUpperCase();
    loadingOverlay.style.display = "flex"; // Change display to flex
    loadingOverlay.style.opacity = "1"; // Set opacity to 1 after changing display
    pdfListContainer.innerHTML = "";
    // Check if the folder with the same name as icaoInput exists
    fetch("/check_folder_exists", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "icao_input=" + encodeURIComponent(icaoInputValue),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.folder_exists) {
          // Folder exists, start the loading animation
          // loadingOverlay.style.opacity = '0'; // Set opacity to 0 before changing display

          // Continue with other actions (e.g., fetching PDF files)
          fetch("/get_pdfs_by_icao/" + icaoInputValue)
            .then((response) => response.json())
            .then((data) => {
              // Clear existing PDF list

              // Populate PDF list with buttons for each PDF file
              data.pdf_files.forEach((pdfFile) => {
                var li = document.createElement("li");
                var button = document.createElement("button");
                button.className = "pdf-button";
                button.setAttribute("data-pdf", pdfFile);
                let text = pdfFile;
                text = text.substring(0, text.length - 6); // Remove the last character
                button.textContent = text;
                li.appendChild(button);
                pdfListContainer.appendChild(li);
              });

              // Update event listeners for the new buttons
              updatePdfButtonListeners();
              if (iframe.style.display == "") {
                iframe.style.display = "flex";
                leftpart.style.width = "400px";
              }
              hideLoadingOverlay();
            })
            .catch((error) => {
              console.error("Error fetching PDF files:", error);
            });
          menuButtons.forEach(function (button) {
            button.addEventListener("click", function () {
              var tag = button.getAttribute("data-tag");
              var icaoInputValue = maxCodeInput.value.trim().toUpperCase();
              filterPdfsByTag(tag, icaoInputValue);
            });
          });
        } else {
          // Folder doesn't exist, handle it accordingly
          handleFolderNotFound(icaoInputValue);
        }
      })
      .catch((error) => {
        console.error("Error checking folder existence:", error);
      });
  }

  function handleFolderNotFound(icaoInput) {
    // Call the server-side function to handle the situation
    fetch("/handle_folder_not_found", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "icao_input=" + encodeURIComponent(icaoInput),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response as needed
        console.log("Folder not found response:", data);
        showLoadingOverlay();
        hideLoadingOverlay();
      })
      .catch((error) => {
        console.error("Error handling folder not found:", error);
      });
  }

  function hideLoadingOverlay() {
    var loadingOverlay = document.querySelector(".loading-overlay");
    fetch("/stop_loading_animation", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        loadingOverlay.style.opacity = "0";
        loadingOverlay.style.display = "none";
      })

      .catch((error) => {
        loadingOverlay.style.opacity = "0";
        loadingOverlay.style.display = "none";
        console.error("Error stopping loading animation:", error);
      });
    loadingOverlay.style.opacity = "0";
    loadingOverlay.style.display = "none";
  }

  function updatePdfButtonListeners() {
    pdfButtons = document.querySelectorAll(".pdf-button");
    pdfButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // showLoadingOverlay();
        var pdfFile = button.getAttribute("data-pdf");
        pdfFrame.src =
          "/static/pdf_downloads/" +
          maxCodeInput.value.trim().toUpperCase() +
          "/" +
          pdfFile;
      });
      var menuButtons = document.querySelectorAll(".menu-button");
      // menuButtons.forEach(function(button) {
      //         button.addEventListener('click', function() {
      //             var tag = button.getAttribute('data-tag');
      //             var icaoInputValue = maxCodeInput.value.trim().toUpperCase();
      //             filterPdfsByTag(tag, icaoInputValue);
      //         });
      //     });

      // Show the PDF button with fade-in effect
      button.style.opacity = "0";
      setTimeout(function () {
        button.style.opacity = "1";
      }, 50);
      // setTimeout(function() {
      //     loadingOverlay.style.opacity = '0';
      //     loadingOverlay.style.display = 'none';
      // }, 50);
    });
  }

  // ... your existing code ...

  // Add event listener for the Load PDF button
  loadPdfBtn.addEventListener("click", function () {
    if (maxCodeInput.value.length === 4) {
      showLoadingOverlay(); // Call the showLoadingOverlay function here
    }
  });
  redownloadPdfBtn.addEventListener("click", function () {
    if (maxCodeInput.value.length === 4) {
      showLoadingOverlay(); // Call the showLoadingOverlay function here
    }
  });
  setTimeout(function () {
    welcomeOverlay.style.opacity = "0";
  }, 900);
  setTimeout(function () {
    welcomeOverlay.style.display = "none"; // Change display to flex
  }, 2700);
  // ... your existing code ...
});
