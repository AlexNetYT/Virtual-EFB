document.addEventListener("DOMContentLoaded", function () {
  var pdfFrame = document.getElementById("pdf-frame");
  var pdfButtons = document.querySelectorAll(".pdf-button");
  var menuButtons = document.querySelectorAll(".menu-button");
  var welcomeOverlay = document.querySelector(".welcome-overlay");
  var maxCodeInput = document.getElementById("icaoInput");
  var loadPdfBtn = document.getElementById("loadPdfBtn");
  var pdfListContainer = document.getElementById("pdfList");
  var loadingOverlay = document.querySelector(".loading-overlay");

  // Execute a function when the user presses a key on the keyboard
  maxCodeInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      loadPdfBtn.click();
    }
  });
  const makeRequest = async (url, options = {}) => {
    const { retries = 3, timeout = 2000 } = options;
  
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
  
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return response;
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
  
        console.log(`Request failed, retrying in 500ms... ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };
  function filterPdfsByTag(tag, icao) {
    // Fetch the PDF files for the specified tag from the server
    makeRequest("/pdf_viewer/get_pdfs_by_tag/" + tag + "/" + icao)
      .then((response) => response.json())
      .then((data) => {
        // Clear existing PDF list
        pdfListContainer.innerHTML = "";
        
        // Populate PDF list with buttons for each PDF file
        data.pdf_files.forEach((pdfFile) => {
          var li = document.createElement("li");
          var button = document.createElement("button");
          button.className = "pdf-button";
          button.setAttribute("data-pdf", pdfFile["fl"]);
          //let text = pdfFile;
          //text = text.substring(0, text.length - 6); // Remove the last character
          button.textContent = pdfFile["fn"];
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

          // Folder exists, start the loading animation
          // loadingOverlay.style.opacity = '0'; // Set opacity to 0 before changing display
          pdfListContainer.innerHTML = "";
          // Continue with other actions (e.g., fetching PDF files)
          makeRequest("/pdf_viewer/get_pdfs_by_icao/" + icaoInputValue)
            .then((response) => response.json())
            .then((data) => {
              // Clear existing PDF list

              // Populate PDF list with buttons for each PDF file
              data.pdf_files.forEach((pdfFile) => {
                var li = document.createElement("li");
                var button = document.createElement("button");
                button.className = "pdf-button";
                button.setAttribute("data-pdf", pdfFile["fl"]);
                //let text = pdfFile;
                //text = text.substring(0, text.length - 6); // Remove the last character
                button.textContent = pdfFile["fn"];
                li.appendChild(button);
                pdfListContainer.appendChild(li);
              });

              // Update event listeners for the new buttons
              updatePdfButtonListeners();
              if (iframe.style.display == "") {
                iframe.style.display = "flex";
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
  }

  function handleFolderNotFound(icaoInput) {
    // Call the server-side function to handle the situation
    fetch("/pdf_viewer/handle_folder_not_found", {
      method: "static",
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
    fetch("/pdf_viewer/stop_loading_animation", { method: "POST" })
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
        pdfFrame.src = pdfFile;
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
  setTimeout(function () {
    welcomeOverlay.style.opacity = "0";
  }, 900);
  setTimeout(function () {
    welcomeOverlay.style.display = "none"; // Change display to flex
  }, 2700);
  // ... your existing code ...
});
