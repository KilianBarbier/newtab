// Extension-specific code for Chrome storage API
const isExtension = typeof chrome !== 'undefined' && chrome.storage;

// Storage helper functions
async function getStorageData(key) {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  }
  return localStorage.getItem(key);
}

async function setStorageData(key, value) {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, value);
}

async function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (e) {
    console.error("Erreur lors de la récupération du favicon:", e);
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
    window.open(shortcut.href, '_blank');
  }
}

function showContextMenu(event, position) {
  event.preventDefault();
  const contextMenu = document.getElementById("contextMenu");
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
}

function generateShortcut(i) {
  return `
      <div class="shortcut-container" 
         ondragover="handleDragOver(event)" 
         ondrop="handleDrop(event, '${i}')"
         ondragenter="handleDragEnter(event)"
         ondragleave="handleDragLeave(event)">
        <a href="#" 
         draggable="true"
         ondragstart="handleDragStart(event, '${i}')"
         onclick="handleShortcutClick(event, '${i}')" 
         oncontextmenu="handleShortcutClick(event, '${i}')"
         data-position="${i}"
         class="group p-6 backdrop-blur-xl bg-white/90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 block">
          <div class="text-center">
            <div class="shortcut-icon" data-empty="true">
              <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/50 flex items-center justify-center text-2xl">
                +
              </div>
            </div>
            <div class="text-white font-medium shortcut-title">Ajouter un raccourci</div>
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
  container.querySelector("a").classList.remove("bg-white/40");

  const oldPosition = event.dataTransfer.getData('text/plain');

  if (oldPosition === '') {
    const data = event.dataTransfer.getData("text");
    if (!data) return;
    try {
      reloadShortcuts();
    } catch (e) {
      console.error("Erreur lors du drop:", e);
    }
    return;
  }

  const activeTab = await getStorageData("activeTab") || "personal";
  const shortcuts = JSON.parse(await getStorageData(`shortcuts_${activeTab}`) || "{}");

  const temp = shortcuts[oldPosition];
  shortcuts[oldPosition] = shortcuts[newPosition];
  shortcuts[newPosition] = temp;

  await setStorageData(`shortcuts_${activeTab}`, JSON.stringify(shortcuts));
  await setStorageData("shortcuts", JSON.stringify(shortcuts));

  reloadShortcuts();

  document.querySelectorAll('.shortcut-container a').forEach(el => {
    el.classList.remove('opacity-50');
  });
}

function handleDragStart(event, position) {
  event.dataTransfer.setData('text/plain', position);
  event.currentTarget.classList.add('opacity-50');
}

function generateAddRowButton() {
  return `
      <button
        onclick="addMoreShortcuts()"
        id="addRowButton"
        class="group p-6 backdrop-blur-xl bg-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-white/30 hover:border-white/60"
      >
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/30 flex items-center justify-center text-2xl text-white">
            +
          </div>
          <div class="text-white font-medium">Ajouter une ligne</div>
        </div>
      </button>`;
}

async function addMoreShortcuts() {
  const grid = document.getElementById("shortcutGrid");
  const currentCount = document.querySelectorAll("[data-position]").length;
  const addRowButton = document.getElementById("addRowButton");

  for (let i = currentCount; i < currentCount + 4; i++) {
    const shortcutElement = document.createElement('div');
    shortcutElement.innerHTML = generateShortcut(i);
    grid.insertBefore(shortcutElement.firstElementChild, addRowButton);
  }

  await setStorageData("shortcutCount", currentCount + 4);
  reloadShortcuts();
}

async function saveShortcut() {
  const modal = document.getElementById("configModal");
  const position = modal.getAttribute("data-position");
  const title = document.getElementById("shortcutTitle").value;
  let url = document.getElementById("shortcutUrl").value.trim();

  if (!url.match(/^https?:\/\//i)) {
    url = "https://" + url;
  }

  try {
    const faviconUrl = await getFaviconUrl(url);
    const activeTab = await getStorageData("activeTab") || "personal";
    const shortcuts = JSON.parse(await getStorageData(`shortcuts_${activeTab}`) || "{}");
    shortcuts[position] = { title, url, faviconUrl };
    await setStorageData(`shortcuts_${activeTab}`, JSON.stringify(shortcuts));
    await setStorageData("shortcuts", JSON.stringify(shortcuts));

    closeConfigModal();
    reloadShortcuts();
  } catch (e) {
    console.error("Erreur lors de la sauvegarde du raccourci:", e);
  }
}

function openConfigModal(position) {
  const modal = document.getElementById("configModal");
  const titleInput = document.getElementById("shortcutTitle");

  modal.setAttribute("data-position", position);
  titleInput.value = "";
  document.getElementById("shortcutUrl").value = "";
  document.getElementById("saveButton").disabled = true;

  modal.classList.remove("hidden");

  titleInput.focus();
  setTimeout(() => titleInput.focus(), 50);
  setTimeout(() => {
    titleInput.focus();
    if (titleInput.value) {
      titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
    }
  }, 150);
}

function closeConfigModal() {
  document.getElementById("configModal").classList.add("hidden");
}

function editShortcut(position) {
  openConfigModal(position, true);
  closeContextMenu();
}

async function deleteShortcut() {
  const position = document.getElementById("contextMenu").getAttribute("data-position");
  const positionNum = parseInt(position);
  const activeTab = await getStorageData("activeTab") || "personal";
  
  const shortcuts = JSON.parse(await getStorageData(`shortcuts_${activeTab}`) || "{}");
  delete shortcuts[position];
  
  let lastUsedPosition = -1;
  for (let i = 0; i < 100; i++) {
    if (shortcuts[i.toString()]) {
      lastUsedPosition = i;
    }
  }
  
  const newCount = Math.ceil((lastUsedPosition + 1) / 4) * 4;
  const shortcutCount = Math.max(4, newCount);
  
  const shortcutElements = document.querySelectorAll(".shortcut-container");
  if (shortcutElements[positionNum]) {
    shortcutElements[positionNum].remove();
  }
  
  await setStorageData("shortcutCount", shortcutCount);
  await setStorageData(`shortcuts_${activeTab}`, JSON.stringify(shortcuts));
  await setStorageData("shortcuts", JSON.stringify(shortcuts));
  
  closeContextMenu();
  reloadShortcuts();
}

function handleSearch(event) {
  if ((event.type === "keydown" && event.key === "Enter") || event.type === "click") {
    event.preventDefault();

    let query = document.getElementById("searchInput").value.trim();
    let selectedEngine = document.getElementById("searchEngine").value;

    const searchEngines = {
      g: "https://www.google.com/search?q=",
      yt: "https://www.youtube.com/results?search_query=",
      gh: "https://github.com/search?q=",
      w: "https://fr.wikipedia.org/wiki/Special:Search?search=",
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

    if (query.startsWith("/")) {
      const parts = query.substring(1).split(" ");
      const command = parts[0].toLowerCase();
      const searchTerms = parts.slice(1).join(" ");

      if (searchEngines[command]) {
        window.open(searchEngines[command] + encodeURIComponent(searchTerms), '_blank');
        return;
      }
    }

    const searchUrl = searchEngines[selectedEngine] || searchEngines["g"];
    if (query) {
      window.open(searchUrl + encodeURIComponent(query), '_blank');
    }
  }
}

async function reloadShortcuts() {
  const grid = document.getElementById("shortcutGrid");
  const activeTab = await getStorageData("activeTab") || "personal";
  const shortcuts = JSON.parse(await getStorageData(`shortcuts_${activeTab}`) || "{}");

  const addRowButton = document.getElementById("addRowButton");
  grid.innerHTML = '';

  const shortcutCount = parseInt(await getStorageData("shortcutCount") || "8");
  
  for (let i = 0; i < shortcutCount; i++) {
    grid.innerHTML += generateShortcut(i);
  }

  for (const position in shortcuts) {
    const shortcutData = shortcuts[position];
    const shortcutElement = document.querySelector(`a[data-position="${position}"]`);
    
    if (shortcutElement && shortcutData) {
      const iconContainer = shortcutElement.querySelector(".shortcut-icon");
      const titleContainer = shortcutElement.querySelector(".shortcut-title");
      
      iconContainer.innerHTML = `<img src="${shortcutData.faviconUrl}" class="w-12 h-12 mx-auto mb-3 rounded-xl" alt="${shortcutData.title}">`;
      iconContainer.setAttribute("data-empty", "false");
      titleContainer.textContent = shortcutData.title;
      shortcutElement.href = shortcutData.url;
    }
  }

  grid.appendChild(addRowButton);
}

async function switchTab(tab) {
  if (await getStorageData("activeTab") === tab) {
    return;
  }

  document.getElementById("personalTab").classList.toggle("bg-white/60", tab === "personal");
  document.getElementById("professionalTab").classList.toggle("bg-white/60", tab === "professional");

  await setStorageData("activeTab", tab);

  const shortcuts = JSON.parse(await getStorageData(`shortcuts_${tab}`) || "{}");
  await setStorageData("shortcuts", JSON.stringify(shortcuts));

  reloadShortcuts();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
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
  document.addEventListener("keydown", focusSearch, { once: true });

  const grid = document.getElementById("shortcutGrid");
  const shortcuts = JSON.parse(await getStorageData("shortcuts") || "{}");
  const shortcutCount = parseInt(await getStorageData("shortcutCount") || "8");

  for (let i = 0; i < shortcutCount; i++) {
    grid.innerHTML += generateShortcut(i);
  }

  grid.innerHTML += generateAddRowButton();

  Object.entries(shortcuts).forEach(([position, data]) => {
    const shortcut = document.querySelector(`[data-position="${position}"]`);
    if (shortcut) {
      const iconContainer = shortcut.querySelector(".shortcut-icon");
      const titleContainer = shortcut.querySelector(".shortcut-title");
      
      iconContainer.innerHTML = `<img src="${data.faviconUrl}" class="w-12 h-12 mx-auto mb-3 rounded-xl" alt="${data.title}">`;
      iconContainer.setAttribute("data-empty", "false");
      titleContainer.textContent = data.title;
      shortcut.href = data.url;
    }
  });

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector(".absolute svg");

  if (searchInput) {
    searchInput.addEventListener("keydown", handleSearch);
  }
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  }

  const activeTab = await getStorageData("activeTab") || "personal";
  switchTab(activeTab);

  // Form validation
  const titleInput = document.getElementById('shortcutTitle');
  const urlInput = document.getElementById('shortcutUrl');
  const saveButton = document.getElementById('saveButton');

  function validateForm() {
    const isValid = titleInput.value.trim() && urlInput.value.trim();
    saveButton.disabled = !isValid;
  }

  titleInput.addEventListener('input', validateForm);
  urlInput.addEventListener('input', validateForm);

  // Search dropdown
  const currentSearch = document.getElementById('currentSearch');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchEngine = document.getElementById('searchEngine');
  const searchEngineText = document.getElementById('searchEngineText');

  currentSearch.addEventListener('click', () => {
    searchDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!currentSearch.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.add('hidden');
    }
  });

  // Search engine options
  const searchOptions = [
    { value: 'g', name: 'Google' },
    { value: 'yt', name: 'YouTube' },
    { value: 'gh', name: 'GitHub' },
    { value: 'w', name: 'Wikipedia' },
    { value: 'r', name: 'Reddit' },
    { value: 'so', name: 'Stack Overflow' },
    { value: 'a', name: 'Amazon' },
    { value: 'n', name: 'Netflix' },
    { value: 'sp', name: 'Spotify' },
    { value: 'tw', name: 'Twitter' },
    { value: 'ig', name: 'Instagram' },
    { value: 'maps', name: 'Google Maps' },
    { value: 'i', name: 'Google Images' },
    { value: 'ddg', name: 'DuckDuckGo' },
    { value: 'px', name: 'Perplexity AI' }
  ];

  searchOptions.forEach(option => {
    const button = document.createElement('button');
    button.className = 'w-full px-4 py-2 text-left hover:bg-white/20 text-gray-800 transition-colors';
    button.textContent = option.name;
    button.addEventListener('click', () => {
      searchEngine.value = option.value;
      searchEngineText.textContent = option.name;
      searchDropdown.classList.add('hidden');
    });
    searchDropdown.appendChild(button);
  });
});
