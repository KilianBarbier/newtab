    // Configure Tailwind only if it's available
    if (typeof tailwind !== 'undefined') {
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sf: [
                "-apple-system",
                "BlinkMacSystemFont",
                "San Francisco",
                "Helvetica Neue",
                "sans-serif",
              ],
            },
          },
        },
      };
    }
    async function getFaviconUrl(url) {
      try {        const domain = new URL(url).hostname;
        // Directly use the Google Favicons API which is more reliable
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } catch (e) {        console.error("Error retrieving favicon:", e);
        // Return a default icon in case of error
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>';
      }
    }

    function handleShortcutClick(event, position) {
      event.preventDefault();
      const shortcut = document.querySelector(
        `[data-position="${position}"]`
      );
      const iconContainer = shortcut.querySelector(".shortcut-icon");
      const isEmpty = iconContainer.getAttribute("data-empty") === "true";

      if (event.type === "contextmenu") {
        showContextMenu(event, position);
      } else if (isEmpty) {
        openConfigModal(position);
      } else {
        window.location.href = shortcut.href;
      }
    }    function showContextMenu(event, position) {
      event.preventDefault();
      const contextMenu = document.getElementById("contextMenu");
      if (!contextMenu) {
        return;
      }
      contextMenu.style.left = `${event.pageX}px`;
      contextMenu.style.top = `${event.pageY}px`;
      contextMenu.setAttribute("data-position", position);
      contextMenu.classList.remove("hidden");
      contextMenu.style.background = "none";
      contextMenu.style.backgroundColor = "transparent";

      document.addEventListener("click", closeContextMenu);
    }

    function closeContextMenu() {
      document.getElementById("contextMenu").classList.add("hidden");
      document.removeEventListener("click", closeContextMenu);
    }    function generateShortcut(i) {
      return `
          <div class="shortcut-container" data-shortcut-index="${i}">            <a href="#" 
             draggable="true"
             data-position="${i}"
             class="group p-6 backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 block">
              <div class="text-center">
                <div class="shortcut-icon" data-empty="true">
                </div>                <div class="text-white font-medium shortcut-title">Add a shortcut</div>
              </div>
            </a>
          </div>`;
    }

    function handleDragOver(event) {
      event.preventDefault();
    }

    function handleDragEnter(event) {
      event.preventDefault();
      const container = event.currentTarget;
      container.querySelector("a").classList.add("bg-white/40");
    }

    function handleDragLeave(event) {
      event.preventDefault();
      const container = event.currentTarget;
      container.querySelector("a").classList.remove("bg-white/40");
    }

    async function handleDrop(event, newPosition) {
      event.preventDefault();
      const container = event.currentTarget;
      container.querySelector("a").classList.remove("bg-white/40");      const oldPosition = event.dataTransfer.getData('text/plain');

      // If it's an external drag (URL)
      if (oldPosition === '') {
        // Keep the existing logic for URL drop
        const data = event.dataTransfer.getData("text");
        if (!data) return;
        try {
          const url = new URL(data);
          let title = "";
          try {
            const response = await fetch(url.href);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            title = doc.title || url.hostname;
          } catch (e) {
            title = url.hostname;
          }

          const shortcuts = JSON.parse(
            localStorage.getItem("shortcuts") || "{}"
          );
          const faviconUrl = await getFaviconUrl(url.href);
          shortcuts[newPosition] = { title, url: url.href, faviconUrl };
          localStorage.setItem("shortcuts", JSON.stringify(shortcuts));

          reloadShortcuts(); // Instead of reloadWithTransition()
        } catch (e) {
          console.error("Invalid URL dropped:", e);
        }
        return;
      }      // If it's an internal drag (rearrangement)
      const activeTab = localStorage.getItem("activeTab") || "personal";
      const shortcuts = JSON.parse(localStorage.getItem(`shortcuts_${activeTab}`) || "{}");

      // Exchange shortcuts
      const temp = shortcuts[oldPosition];
      shortcuts[oldPosition] = shortcuts[newPosition];
      shortcuts[newPosition] = temp;

      // Save changes
      localStorage.setItem(`shortcuts_${activeTab}`, JSON.stringify(shortcuts));
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));

      // Reload shortcuts
      reloadShortcuts();

      // Remove temporary style classes
      document.querySelectorAll('.shortcut-container a').forEach(el => {
        el.classList.remove('opacity-50');
      });
    }

    function handleDragStart(event, position) {
      event.dataTransfer.setData('text/plain', position);
      event.currentTarget.classList.add('opacity-50');
    } function generateAddRowButton() {
      return `
          <button
             class="group p-6 backdrop-blur-xl bg-white/30 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/40 transition-all duration-300 border-2 border-dashed border-white/30 w-full"
             id="addRowButton">
            <div class="text-center">
              <div class="flex justify-center mb-2">
                <svg class="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>              <div class="text-white/70 font-medium">Add more shortcuts</div>
            </div>
          </button>`;
    } function addMoreShortcuts() {
      const grid = document.getElementById("shortcutGrid");
      const currentCount =
        document.querySelectorAll("[data-position]").length;
      const addRowButton = document.getElementById("addRowButton");

      for (let i = currentCount; i < currentCount + 4; i++) {
        grid.insertBefore(
          document
            .createRange()
            .createContextualFragment(generateShortcut(i)),
          addRowButton
        );
      }

      localStorage.setItem("shortcutCount", currentCount + 4);
      
      // Setup event listeners for new shortcuts
      setupShortcutEventListeners();
      
      reloadShortcuts(); // Au lieu de reloadWithTransition()
    }async function saveShortcut() {
      const modal = document.getElementById("configModal");
      const position = modal.getAttribute("data-position");
      const title = document.getElementById("shortcutTitle").value;
      let url = document.getElementById("shortcutUrl").value.trim();

      if (!url.match(/^https?:\/\//i)) {
        url = "https://" + url;
      }

      try {
        const faviconUrl = await getFaviconUrl(url);
        const activeTab = localStorage.getItem("activeTab") || "personal";
        const shortcuts = JSON.parse(
          localStorage.getItem(`shortcuts_${activeTab}`) || "{}"
        );
        shortcuts[position] = { title, url, faviconUrl };
        localStorage.setItem(
          `shortcuts_${activeTab}`,
          JSON.stringify(shortcuts)
        );
        localStorage.setItem("shortcuts", JSON.stringify(shortcuts));

        closeConfigModal();
        reloadShortcuts(); // Instead of reloadWithTransition()
      } catch (e) {
        console.error("Error saving shortcut:", e);
      }
    }    function openConfigModal(position) {
      const modal = document.getElementById("configModal");
      const titleInput = document.getElementById("shortcutTitle");

      modal.setAttribute("data-position", position);
      titleInput.value = "";
      document.getElementById("shortcutUrl").value = "";
      document.getElementById("saveButton").disabled = true;

      modal.classList.remove("hidden");

      // Improved focus method with multiple attempts
      // First immediate attempt
      titleInput.focus();

      // Second attempt with a short delay
      setTimeout(() => {
        titleInput.focus();
      }, 50);

      // Third attempt with a longer delay to ensure the modal is fully rendered
      setTimeout(() => {
        titleInput.focus();
        // Move cursor to the end of text
        if (titleInput.value) {
          titleInput.selectionStart = titleInput.value.length;
          titleInput.selectionEnd = titleInput.value.length;
        }
      }, 150);
    }

    function closeConfigModal() {
      document.getElementById("configModal").classList.add("hidden");
    }

    function editShortcut(position) {
      openConfigModal(position, true);
      closeContextMenu();
    }    function deleteShortcut() {
      const position = document
        .getElementById("contextMenu")
        .getAttribute("data-position");
      const positionNum = parseInt(position);
      const activeTab = localStorage.getItem("activeTab") || "personal";
      
      // Get shortcuts from localStorage
      const shortcuts = JSON.parse(
        localStorage.getItem(`shortcuts_${activeTab}`) || "{}"
      );
      
      // Remove the shortcut from stored data
      delete shortcuts[position];
      
      // Count the number of shortcuts actually used
      let lastUsedPosition = -1;
      for (let i = 0; i < 100; i++) { // Examine a large number to be sure
        if (shortcuts[i.toString()]) {
          lastUsedPosition = Math.max(lastUsedPosition, i);
        }
      }
      
      // Calculate the new shortcut count
      // Round to the next multiple of 4
      const newCount = Math.ceil((lastUsedPosition + 1) / 4) * 4;
      // Ensure a minimum of 4 shortcuts
      const shortcutCount = Math.max(4, newCount);
      
      // Directly remove the element from the DOM
      const shortcutElements = document.querySelectorAll(".shortcut-container");
      if (shortcutElements[positionNum]) {
        shortcutElements[positionNum].remove();
      }
      
      // Update localStorage
      localStorage.setItem("shortcutCount", shortcutCount);
      localStorage.setItem(`shortcuts_${activeTab}`, JSON.stringify(shortcuts));
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      
      closeContextMenu();
      
      // Reload shortcuts without refreshing the page
      reloadShortcuts();
    }    document.addEventListener("DOMContentLoaded", () => {
      // Setup all event listeners first
      setupEventListeners();

      function focusSearch() {
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
          searchInput.focus();
        }
      }

      focusSearch();
      setTimeout(focusSearch, 100);

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          focusSearch();
        }
      });

      window.addEventListener("focus", focusSearch);
      document.addEventListener("mouseenter", focusSearch);
      document.addEventListener("keydown", focusSearch, { once: true });      // Initialize shortcuts with reloadShortcuts function
      reloadShortcuts();
      
      // Fallback: add test content if grid is still empty after 1 second
      setTimeout(() => {
        const grid = document.getElementById("shortcutGrid");
        if (grid && grid.innerHTML.trim() === '') {
          console.log("Grid is empty, adding test content");
          grid.innerHTML = `
            <div class="shortcut-container">
              <a href="#" class="group p-6 backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 block">
                <div class="text-center">
                  <div class="shortcut-icon">
                    <div class="w-12 h-12 bg-white/20 rounded-lg mx-auto flex items-center justify-center">
                      <span class="text-2xl">🌐</span>
                    </div>
                  </div>
                  <div class="text-white font-medium shortcut-title mt-2">Test Shortcut</div>
                </div>
              </a>
            </div>
          `;
        }
      }, 1000);

      // Initialiser l'onglet actif
      const activeTab = localStorage.getItem("activeTab") || "personal";
      switchTab(activeTab);

      // Setup favicon error handling for initially loaded shortcuts
      setTimeout(() => {
        setupFaviconErrorHandling();
      }, 100);
    });

    function handleSearch(event) {
      if (
        (event.type === "keydown" && event.key === "Enter") ||
        event.type === "click"
      ) {
        event.preventDefault();

        let query = document.getElementById("searchInput").value.trim();
        let selectedEngine = document.getElementById("searchEngine").value;

        const searchEngines = {
          g: "https://www.google.com/search?q=",
          yt: "https://www.youtube.com/results?search_query=",
          gh: "https://github.com/search?q=",
          w: "https://en.wikipedia.org/wiki/Special:Search?search=",
          r: "https://www.reddit.com/search/?q=",
          so: "https://stackoverflow.com/search?q=",
          a: "https://www.amazon.fr/s?k=",
          n: "https://www.netflix.com/search?q=",
          sp: "https://open.spotify.com/search/results",
          tw: "https://twitter.com/search?q=",
          ig: "https://www.instagram.com/explore/tags/",
          maps: "https://www.google.com/maps/search/",
          i: "https://www.google.com/images?q=",
          ddg: "https://duckduckgo.com/?q=",
          px: "https://www.perplexity.ai/search?q=",
        };      // Check if we should suggest an autocorrection
      if (shouldSuggestAutocorrection(query)) {
        // Display the autocorrection popup
        showAutocorrectionModal(query);
        return; // Stop execution here
      }

        if (query.startsWith("/")) {
          const parts = query.substring(1).split(" ");
          if (parts.length > 1) {
            const possibleCommand = parts[0].toLowerCase();
            if (searchEngines[possibleCommand]) {
              selectedEngine = possibleCommand;
              query = parts.slice(1).join(" ");
            }
          }
        }

        const searchUrl = searchEngines[selectedEngine] || searchEngines["g"];
        if (query) {
          window.location.href = searchUrl + encodeURIComponent(query);
        }
      }
    }    // Function to check if we should suggest an autocorrection
    function shouldSuggestAutocorrection(query) {
      // Only suggest autocorrection IF the query starts with ":"
      if (!query.startsWith(":")) {
        return false;
      }
      // List of valid commands
      const validSearchCommands = {
        "g": "Google",
        "yt": "YouTube",
        "gh": "GitHub",
        "w": "Wikipedia",
        "r": "Reddit",
        "so": "Stack Overflow",
        "a": "Amazon",
        "n": "Netflix",
        "sp": "Spotify",
        "tw": "Twitter",
        "ig": "Instagram",
        "maps": "Google Maps",
        "i": "Google Images",
        "ddg": "DuckDuckGo",
        "px": "Perplexity AI"
      };
      // Extract the part after ":" (until the first space or end of string)
      const commandPart = query.substring(1).split(" ")[0].toLowerCase();
      // Check if this part matches a valid command
      return Object.keys(validSearchCommands).includes(commandPart);
    }    // Function to display the autocorrection modal
    function showAutocorrectionModal(originalQuery) {
      const correctedQuery = convertToSearchCommand(originalQuery);
      document.getElementById("originalQuery").textContent = originalQuery;
      document.getElementById("correctedQuery").textContent = correctedQuery;
      document.getElementById("autocorrectionModal").classList.remove("hidden");
      // Store queries for later use
      document.getElementById("autocorrectionModal").setAttribute("data-original-query", originalQuery);
      document.getElementById("autocorrectionModal").setAttribute("data-corrected-query", correctedQuery);
      // Add listener for Shift+Y and Shift+N
      function autocorrectKeyListener(e) {
        if (e.shiftKey && (e.key === 'Y' || e.key === 'y')) {
          executeCorrectedSearch();
          document.removeEventListener('keydown', autocorrectKeyListener);
        } else if (e.shiftKey && (e.key === 'N' || e.key === 'n')) {
          executeOriginalSearch();
          document.removeEventListener('keydown', autocorrectKeyListener);
        }
      }
      document.addEventListener('keydown', autocorrectKeyListener);
    }    // Function to convert a query to appropriate search
    function convertToSearchCommand(query) {
      // Complete list of valid search commands
      const validSearchCommands = {
        "g": "Google",
        "yt": "YouTube",
        "gh": "GitHub",
        "w": "Wikipedia",
        "r": "Reddit",
        "so": "Stack Overflow",
        "a": "Amazon",
        "n": "Netflix",
        "sp": "Spotify",
        "tw": "Twitter",
        "ig": "Instagram",
        "maps": "Google Maps",
        "i": "Google Images",
        "ddg": "DuckDuckGo",
        "px": "Perplexity AI"
      };

      // Get the currently selected engine
      const currentEngine = document.getElementById("searchEngine").value;
      const currentEngineName = validSearchCommands[currentEngine] || "Google";

      // Remove the ":" at the beginning if present
      if (query.startsWith(":")) {
        query = query.substring(1);
      }

      // Convert to lowercase
      const lowercaseQuery = query.toLowerCase().trim();

      // Detect if the first word is a search command
      let detectedCommand = null;
      let searchTerms = lowercaseQuery;

      // Check the first word (or letter)
      const firstSpace = lowercaseQuery.indexOf(" ");
      if (firstSpace > 0) {
        const possibleCommand = lowercaseQuery.substring(0, firstSpace).toLowerCase();

        // Strictly check if the command is in our list of valid commands
        if (Object.keys(validSearchCommands).includes(possibleCommand)) {
          detectedCommand = possibleCommand;
          searchTerms = lowercaseQuery.substring(firstSpace + 1);
        }
        // Don't try to interpret any text as a command
      } else if (Object.keys(validSearchCommands).includes(lowercaseQuery)) {
        // If the entire query is exactly a valid command
        detectedCommand = lowercaseQuery;
        searchTerms = "";
      }

      // If a valid command was detected, use it
      if (detectedCommand) {
        document.getElementById("autocorrectionModal").querySelector("p.mt-2").textContent =
          `The search will be performed on ${validSearchCommands[detectedCommand]}`;
        return `/${detectedCommand} ${searchTerms}`.trim();
      }

      // By default, use the currently selected search engine with the entire query
      document.getElementById("autocorrectionModal").querySelector("p.mt-2").textContent =
        `The search will be performed on ${currentEngineName}`;
      return `/${currentEngine} ${lowercaseQuery}`;
    }    // Function to execute the original search
    function executeOriginalSearch() {
      const originalQuery = document.getElementById("autocorrectionModal").getAttribute("data-original-query");
      document.getElementById("autocorrectionModal").classList.add("hidden");

      // Get the currently selected search engine
      let selectedEngine = document.getElementById("searchEngine").value;

      // Directly extract search URLs to avoid going through the autocorrection process again
      const searchEngines = {
        g: "https://www.google.com/search?q=",
        yt: "https://www.youtube.com/results?search_query=",
        gh: "https://github.com/search?q=",
        w: "https://en.wikipedia.org/wiki/Special:Search?search=",
        r: "https://www.reddit.com/search/?q=",
        so: "https://stackoverflow.com/search?q=",
        a: "https://www.amazon.fr/s?k=",
        n: "https://www.netflix.com/search?q=",
        sp: "https://open.spotify.com/search/results",
        tw: "https://twitter.com/search?q=",
        ig: "https://www.instagram.com/explore/tags/",
        maps: "https://www.google.com/maps/search/",
        i: "https://www.google.com/images?q=",
        ddg: "https://duckduckgo.com/?q=",
        px: "https://www.perplexity.ai/search?q=",
      };

      // Check if the query starts with a specific command
      if (originalQuery.startsWith("/")) {
        const parts = originalQuery.substring(1).split(" ");
        if (parts.length > 0 && searchEngines[parts[0].toLowerCase()]) {
          selectedEngine = parts[0].toLowerCase();
          query = parts.slice(1).join(" ");
          window.location.href = searchEngines[selectedEngine] + encodeURIComponent(query);
          return;
        }
      }

      // If no specific command, use the original query directly
      window.location.href = searchEngines[selectedEngine] + encodeURIComponent(originalQuery);
    }    // Function to execute the corrected search
    function executeCorrectedSearch() {
      const correctedQuery = document.getElementById("autocorrectionModal").getAttribute("data-corrected-query");
      document.getElementById("searchInput").value = correctedQuery;
      document.getElementById("autocorrectionModal").classList.add("hidden");

      // Extract the search command and search terms
      if (correctedQuery.startsWith('/')) {
        const parts = correctedQuery.substring(1).split(' ');
        const command = parts[0].toLowerCase();
        const searchTerms = parts.slice(1).join(' ');

        const searchEngines = {
          g: "https://www.google.com/search?q=",
          yt: "https://www.youtube.com/results?search_query=",
          gh: "https://github.com/search?q=",
          w: "https://en.wikipedia.org/wiki/Special:Search?search=",
          r: "https://www.reddit.com/search/?q=",
          so: "https://stackoverflow.com/search?q=",
          a: "https://www.amazon.fr/s?k=",
          n: "https://www.netflix.com/search?q=",
          sp: "https://open.spotify.com/search/results",
          tw: "https://twitter.com/search?q=",
          ig: "https://www.instagram.com/explore/tags/",
          maps: "https://www.google.com/maps/search/",
          i: "https://www.google.com/images?q=",
          ddg: "https://duckduckgo.com/?q=",
          px: "https://www.perplexity.ai/search?q=",
        };

        // If the command is valid, execute the search directly
        if (searchEngines[command]) {
          window.location.href = searchEngines[command] + encodeURIComponent(searchTerms);
          return;
        }
      }

      // Fallback: execute the search via handleSearch
      handleSearch({ type: "click" });    }function reloadShortcuts() {
      const grid = document.getElementById("shortcutGrid");
      if (!grid) {
        return;
      }
      
      const activeTab = localStorage.getItem("activeTab") || "personal";
      const shortcuts = JSON.parse(localStorage.getItem(`shortcuts_${activeTab}`) || "{}");

      // Vider la grille
      grid.innerHTML = '';

      // Déterminer le nombre réel de raccourcis à afficher
      const shortcutCount = parseInt(localStorage.getItem("shortcutCount") || "8");
      
      // Recréer les raccourcis
      for (let i = 0; i < shortcutCount; i++) {
        const shortcutHTML = generateShortcut(i);
        grid.innerHTML += shortcutHTML;
      }

      // Ajouter le bouton d'ajout
      const addButtonHTML = generateAddRowButton();
      console.log("Generated add button:", addButtonHTML);
      grid.innerHTML += addButtonHTML;
        console.log("Grid innerHTML after generation:", grid.innerHTML);

      // Mettre à jour l'apparence des raccourcis avec les données stockées
      for (const position in shortcuts) {
        const shortcutData = shortcuts[position];
        const shortcutElement = document.querySelector(`a[data-position="${position}"]`);
        
        if (shortcutElement && shortcutData) {
          // Mettre à jour l'apparence du raccourci
          const iconElement = shortcutElement.querySelector('.shortcut-icon');
          const titleElement = shortcutElement.querySelector('.shortcut-title');
          
          if (shortcutData.iconURL) {
            iconElement.innerHTML = `<img src="${shortcutData.iconURL}" alt="${shortcutData.title}" class="mx-auto h-12 w-12 rounded">`;
            iconElement.setAttribute('data-empty', 'false');
          }
          
          if (shortcutData.title) {
            titleElement.textContent = shortcutData.title;
          }
          
          if (shortcutData.url) {
            shortcutElement.href = shortcutData.url;
          }
        }
      }      // Setup event listeners manually
      document.querySelectorAll('a[data-position]').forEach(link => {
        const position = link.getAttribute('data-position');
        
        link.addEventListener("click", (e) => {
          handleShortcutClick(e, position);
        });
        
        link.addEventListener("contextmenu", (e) => {
          handleShortcutClick(e, position);
        });
      });
      
      // Setup add button listener
      const addButton = document.getElementById('addRowButton');
      if (addButton) {
        addButton.addEventListener('click', () => {
          addMoreShortcuts();
        });
      }

      // Setup favicon error handling
      setupFaviconErrorHandling();

      // Mettre à jour les raccourcis avec leurs données
      Object.entries(shortcuts).forEach(([position, data]) => {
        const shortcut = document.querySelector(`[data-position="${position}"]`);
        if (shortcut) {
          shortcut.href = data.url;
          shortcut.onclick = (e) => {
            e.preventDefault();
            window.location.href = data.url;
          };
          shortcut.querySelector(".shortcut-title").textContent = data.title;
          const iconContainer = shortcut.querySelector(".shortcut-icon");
          iconContainer.removeAttribute("data-empty");
          iconContainer.innerHTML = `
              <img src="${data.faviconUrl}" 
                 class="w-8 h-8 mt-2 mb-2 group-hover:scale-120 transition-transform duration-300" 
                 alt="${data.title}" 
                 data-fallback="this.src='data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🌐</text></svg>\'">`;
        }
      });
    }

    function switchTab(tab) {
      // Don't do anything if we're already on the selected tab
      if (localStorage.getItem("activeTab") === tab) {
        return;
      }

      // Update visual interface
      document.getElementById("personalTab").classList.toggle("bg-white/60", tab === "personal");
      document.getElementById("professionalTab").classList.toggle("bg-white/60", tab === "professional");

      // Save active tab
      localStorage.setItem("activeTab", tab);

      // Load corresponding shortcuts
      const shortcuts = JSON.parse(localStorage.getItem(`shortcuts_${tab}`) || "{}");
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));

    }

document
            .getElementById("currentSearch")
            .addEventListener("click", () => {
              const dropdown = document.getElementById(
                "searchEngineDropdown"
              );
              dropdown.classList.toggle("hidden");
            });

          document.querySelectorAll(".search-option").forEach((option) => {
            option.addEventListener("click", (e) => {
              const value = e.currentTarget.dataset.value;
              const img = e.currentTarget.querySelector("img");

              // Mettre à jour l'icône visible
              document.querySelector("#currentSearch img").src = img.src;

              // Mettre à jour le select caché
              document.getElementById("searchEngine").value = value;

              // Ajouter la commande au début de la recherche
              const searchInput = document.getElementById("searchInput");
              const currentText = searchInput.value.trim();

              // Si le texte commence déjà par une commande, on la remplace
              let newText = currentText;
              if (currentText.startsWith("/")) {
                // Correction ici : startswith -> startsWith
                const parts = currentText.substring(1).split(" ");
                const possibleCommand = parts[0].toLowerCase();
                // Liste des commandes valides (doit correspondre à handleSearch)
                const validCommands = [
                  "g",
                  "yt",
                  "gh",
                  "w",
                  "r",
                  "so",
                  "a",
                  "n",
                  "sp",
                  "tw",
                  "ig",
                  "maps",
                  "i",
                ];
                if (validCommands.includes(possibleCommand)) {
                  // Prendre tout sauf la commande
                  newText = parts.slice(1).join(" ");
                }
              }

              // Garantir qu'il y a toujours un espace après la commande si newText n'est pas vide
              if (newText.length > 0) {
                searchInput.value = `/${value} ${newText}`;              } else {
                // If no text, just add the command with a space at the end to make typing easier
                searchInput.value = `/${value} `;
              }              // Close the dropdown
              document
                .getElementById("searchEngineDropdown")
                .classList.add("hidden");

              // Refocus on the search field
              searchInput.focus();
              // Place cursor at the end of text
              searchInput.selectionStart = searchInput.value.length;
              searchInput.selectionEnd = searchInput.value.length;
            });
          });          // Close dropdown if clicked elsewhere
          document.addEventListener("click", (e) => {
            if (!e.target.closest(".relative")) {
              document
                .getElementById("searchEngineDropdown")
                .classList.add("hidden");
            }
          });

          // Make sure the search button triggers search with the selected engine
          document.querySelector(".absolute svg").addEventListener("click", function (event) {
              handleSearch(event);
            });

          // Ensure document is ready
          document.addEventListener("DOMContentLoaded", () => {
            // Reset search listeners to avoid duplicates
            const searchInput = document.getElementById("searchInput");
            const searchIcon = document.querySelector(".absolute svg");

            // Remove existing listeners if any
            searchInput.removeEventListener("keydown", handleSearch);
            searchIcon.removeEventListener("click", handleSearch);

            // Add new listeners
            searchInput.addEventListener("keydown", handleSearch);
            searchIcon.addEventListener("click", handleSearch);
          });

        // List of common domain extensions
        const validTLDs = [
          "com",
          "net",
          "org",
          "edu",
          "gov",
          "mil",
          "io",
          "co",
          "ai",
          "app",
          "dev",
          "me",
          "tv",
          "info",
          "biz",
          "name",
          "mobi",
          "pro",
          "travel",
          // Common national domains
          "fr",
          "uk",
          "de",
          "it",
          "es",
          "nl",
          "ru",
          "cn",
          "jp",
          "kr",
          "br",
          "au",
          "ca",
          "in",
          "eu",
        ];

        function isValidUrl(string) {
          try {
            const url = string.trim();
            if (!url) return false;            // Add https:// if needed
            const urlToTest = url.match(/^https?:\/\//i)
              ? url
              : `https://${url}`;
            const urlObj = new URL(urlToTest);

            // Check hostname
            const parts = urlObj.hostname.split(".");
            if (parts.length < 2) return false;

            // Check that the extension follows standard format
            // An extension is typically 2-12 characters and contains only letters
            const tld = parts[parts.length - 1].toLowerCase();
            return /^[a-z]{2,12}$/.test(tld);
          } catch (err) {
            return false;
          }
        }        // Improved validation function
        function validateForm() {
          const title = document.getElementById("shortcutTitle").value.trim();
          const url = document.getElementById("shortcutUrl").value.trim();
          const saveButton = document.getElementById("saveButton");
          const urlError = document.getElementById("urlError");

          const isTitleValid = title.length > 0;
          const isUrlValid = isValidUrl(url);

          // Show/hide error message
          if (url && !isUrlValid) {
            urlError.classList.remove("hidden");
          } else {
            urlError.classList.add("hidden");
          }

          saveButton.disabled = !isTitleValid || !isUrlValid;
        }        // Modification of openConfigModal to reset button state
        function openConfigModal(position) {
          const modal = document.getElementById("configModal");
          modal.setAttribute("data-position", position);

          document.getElementById("shortcutTitle").value = "";
          document.getElementById("shortcutUrl").value = "";
          document.getElementById("saveButton").disabled = true;

          modal.classList.remove("hidden");
          document.getElementById("shortcutTitle").focus();
        }

function showSearchHelp() {
          document
            .getElementById("searchHelpModal")
            .classList.remove("hidden");
        }

        function closeSearchHelp() {
          document.getElementById("searchHelpModal").classList.add("hidden");
        }

    document.addEventListener("DOMContentLoaded", function () {
      const sidebarChildren = document.querySelectorAll(
        "#sidebar > *:not(:first-child)"
      );
      const sidebarContent = document.getElementById("sidebarContent");

      sidebarChildren.forEach((child) => {
        sidebarContent.appendChild(child.cloneNode(true));
      });

      const showSidebarBtn = document.getElementById("showSidebar");
      const closeSidebarBtn = document.getElementById("closeSidebar");
      const sidebarModal = document.getElementById("sidebarModal");

      showSidebarBtn.addEventListener("click", function () {
        sidebarModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      });

      closeSidebarBtn.addEventListener("click", function () {
        sidebarModal.classList.add("hidden");
        document.body.style.overflow = "";
      });

      sidebarModal.addEventListener("click", function (e) {
        if (e.target === sidebarModal) {
          sidebarModal.classList.add("hidden");
          document.body.style.overflow = "";
        }
      });
    });

    // Function to setup all event listeners
    function setupEventListeners() {
      // Tab switching
      const personalTab = document.getElementById("personalTab");
      const professionalTab = document.getElementById("professionalTab");
      
      if (personalTab) {
        personalTab.addEventListener("click", () => switchTab('personal'));
      }
      
      if (professionalTab) {
        professionalTab.addEventListener("click", () => switchTab('professional'));
      }

      // Search help buttons
      const searchHelpButton = document.getElementById("searchHelpButton");
      const mobileSearchHelpButton = document.getElementById("mobileSearchHelpButton");
      const closeSearchHelpButton = document.getElementById("closeSearchHelpButton");
      
      if (searchHelpButton) {
        searchHelpButton.addEventListener("click", showSearchHelp);
      }
      
      if (mobileSearchHelpButton) {
        mobileSearchHelpButton.addEventListener("click", showSearchHelp);
      }
      
      if (closeSearchHelpButton) {
        closeSearchHelpButton.addEventListener("click", closeSearchHelp);
      }

      // Modal buttons
      const shortcutTitle = document.getElementById("shortcutTitle");
      const shortcutUrl = document.getElementById("shortcutUrl");
      const cancelButton = document.getElementById("cancelButton");
      const saveButton = document.getElementById("saveButton");
      
      if (shortcutTitle) {
        shortcutTitle.addEventListener("input", validateForm);
      }
      
      if (shortcutUrl) {
        shortcutUrl.addEventListener("input", validateForm);
      }
      
      if (cancelButton) {
        cancelButton.addEventListener("click", closeConfigModal);
      }
      
      if (saveButton) {
        saveButton.addEventListener("click", saveShortcut);
      }

      // Context menu buttons
      const editShortcutButton = document.getElementById("editShortcutButton");
      const deleteShortcutButton = document.getElementById("deleteShortcutButton");
      
      if (editShortcutButton) {
        editShortcutButton.addEventListener("click", () => {
          const position = document.getElementById('contextMenu').getAttribute('data-position');
          editShortcut(position);
        });
      }
      
      if (deleteShortcutButton) {
        deleteShortcutButton.addEventListener("click", deleteShortcut);
      }

      // Autocorrection modal buttons
      const executeOriginalSearchButton = document.getElementById("executeOriginalSearchButton");
      const executeCorrectedSearchButton = document.getElementById("executeCorrectedSearchButton");
      
      if (executeOriginalSearchButton) {
        executeOriginalSearchButton.addEventListener("click", executeOriginalSearch);
      }
      
      if (executeCorrectedSearchButton) {
        executeCorrectedSearchButton.addEventListener("click", executeCorrectedSearch);
      }

      // Add row button
      const addRowButton = document.getElementById("addRowButton");
      if (addRowButton) {
        addRowButton.addEventListener("click", addMoreShortcuts);
      }

      // Setup shortcut event listeners
      setupShortcutEventListeners();
    }

    // Function to setup event listeners for shortcuts (called after generating new shortcuts)
    function setupShortcutEventListeners() {
      console.log("Setting up shortcut event listeners");
      document.querySelectorAll('.shortcut-container').forEach(container => {
        const shortcutLink = container.querySelector('a[data-position]');
        
        if (shortcutLink) {
          const position = shortcutLink.getAttribute('data-position');
          console.log("Setting up listeners for position:", position);
          
          // Remove existing listeners to avoid duplicates
          shortcutLink.replaceWith(shortcutLink.cloneNode(true));
          const newShortcutLink = container.querySelector('a[data-position]');
          
          // Add event listeners
          newShortcutLink.addEventListener("click", (e) => {
            console.log("Shortcut clicked, position:", position);
            handleShortcutClick(e, position);
          });
          newShortcutLink.addEventListener("contextmenu", (e) => {
            console.log("Shortcut right-clicked, position:", position);
            handleShortcutClick(e, position);
          });
          newShortcutLink.addEventListener("dragstart", (e) => handleDragStart(e, position));
          
          // Container drag events
          container.addEventListener("dragover", handleDragOver);
          container.addEventListener("drop", (e) => handleDrop(e, position));
          container.addEventListener("dragenter", handleDragEnter);
          container.addEventListener("dragleave", handleDragLeave);
        }
      });
    }

    // Function to setup favicon error handling
    function setupFaviconErrorHandling() {
      document.querySelectorAll('.shortcut-icon img').forEach(img => {
        img.removeEventListener('error', handleFaviconError);
        img.addEventListener('error', handleFaviconError);
      });
    }    function handleFaviconError(event) {
      event.target.src = 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🌐</text></svg>';
    }
    
    // Function to create favicon image with proper error handling
    function createFaviconImage(faviconUrl, title) {
      const img = document.createElement('img');
      img.src = faviconUrl;
      img.className = 'w-8 h-8 mt-2 mb-2 group-hover:scale-120 transition-transform duration-300';
      img.alt = title;
      img.addEventListener('error', handleFaviconError);
      return img;
    }
  