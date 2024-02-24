let searchEngine = "google";
const browserIcons = {
    "Firefox": 'src/images/firefox-icon.png',
    "Opera": 'src/images/opera-icon.png',
    "Safari": 'src/images/safari-icon.png',
    "Internet Explorer": 'src/images/ie-icon.png',
    "Edge": 'src/images/edge-icon.png',
    "Chrome": 'src/images/chrome-icon.png',
};



function getBrowserType() {
    const test = regexp => regexp.test(navigator.userAgent);
    console.log(navigator.userAgent);

    const browserTypes = {
        "opr": "Opera",
        "edg": "Edge",
        "chrome|chromium|crios": "Chrome",
        "firefox|fxios": "Firefox",
        "safari": "Safari",
        "trident": "Internet Explorer",
        "ucbrowser": "UC Browser",
        "samsungbrowser": "Samsung Browser",
    };

    for (const [pattern, browser] of Object.entries(browserTypes)) {
        if (test(new RegExp(pattern, 'i')) || window[browser.toLowerCase()]) {
            return browser;
        }
    }

    return 'Unknown browser';
}

function getSearchEngineToUse() {
    const test = regexp => regexp.test(searchEngine);
    console.log(searchEngine);

    const searchEngineTypes = {
        "google": "https://www.google.com/search?q=",
        "duckduckgo": "https://duckduckgo.com/?t=h_&q=",
        "qwant": "https://www.qwant.com/?q=",
    };

    for (const [pattern, engine] of Object.entries(searchEngineTypes)) {
        if (test(new RegExp(pattern, 'i')) || window[engine.toLowerCase()]) {
            return engine;
        }
    }

    return 'Unknown engine';
}

async function validateUrl(url) {
    try {
        const response = await fetch(url);
        return { result: url };
    } catch (err) {
        const error = {
            code: 'Fetching image',
            message: 'Something went wrong.',
            rawError: err,
        };
        console.error(error);
        return [1, { error }];
    }
}

var browser = getBrowserType();
const browserIcon = document.getElementById('browser-icon');
const tabTitle = document.getElementById('tab-title');

if (browser in browserIcons) {
    browserIcon.src = browserIcons[browser];
    tabTitle.innerText = browser.toLowerCase();
} else {
    tabTitle.innerText = "unknown";
}

// SHORTCUTS
let shortcutButtonsData = JSON.parse(localStorage.getItem('shortcutButtons')) || [];
const shortcutButtonsContainer = document.getElementById('shortcut-buttons');

function createShortcutButtons() {
    shortcutButtonsContainer.innerHTML = '';

    shortcutButtonsData.forEach(button => {
        const shortcutButton = createShortcutButton(button);
        shortcutButtonsContainer.appendChild(shortcutButton);
    });
}

function createShortcutButton(button) {
    const shortcutButton = document.createElement('a');
    shortcutButton.href = button.url.startsWith('http') ? button.url : 'https://' + button.url;
    shortcutButton.textContent = button.name;
    shortcutButton.classList.add('shortcut-button');

    let rightClickCount = 0;

    shortcutButton.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        rightClickCount++;
        if (rightClickCount === 2) {
            rightClickCount = 0;
            removeShortcut(button);
        }
    });

    shortcutButton.addEventListener('click', function(event) {
        if (event.button === 1) {
            event.preventDefault();
            removeShortcut(button);
        } else {
            rightClickCount = 0;
            window.location.href = shortcutButton.href;
        }
    });

    return shortcutButton;
}

function removeShortcut(button) {
    const index = shortcutButtonsData.indexOf(button);
    if (index !== -1) {
        shortcutButtonsData.splice(index, 1);
        localStorage.setItem('shortcutButtons', JSON.stringify(shortcutButtonsData));
        createShortcutButtons();
    }
}

function addNewShortcut() {
    const newName = document.getElementById('newShortcutName').value;
    const newUrl = document.getElementById('newShortcutUrl').value;

    shortcutButtonsData.push({ name: newName, url: newUrl });

    localStorage.setItem('shortcutButtons', JSON.stringify(shortcutButtonsData));

    createShortcutButtons();

    document.getElementById('newShortcutName').value = '';
    document.getElementById('newShortcutUrl').value = '';
    toggleMenu("addShortcutMenu");
}

// BACKGROUND
let backgroundButtonsData = JSON.parse(localStorage.getItem('backgrounds')) || [];
const backgroundGalleryContainer = document.getElementById('side-menu-gallery');

function createBackgroundButtons() {
    backgroundGalleryContainer.innerHTML = '';

    backgroundButtonsData.forEach(background => {
        const backgroundButton = createBackgroundButton(background);
        backgroundGalleryContainer.appendChild(backgroundButton);
    });
}

function createBackgroundButton(background) {
    const backgroundButton = document.createElement('bg-image');
    backgroundButton.classList.add('background-button');
    backgroundButton.style.backgroundImage = `url(${background.url})`;
    backgroundButton.setAttribute("draggable", 'true');

    backgroundButton.addEventListener("dragstart", () => {
        backgroundButton.classList.add("dragging");
    });

    backgroundButton.addEventListener("dragend", () => {
        backgroundButton.classList.remove("dragging");
    });

    let rightClickCount = 0;

    backgroundButton.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        rightClickCount++;
        if (rightClickCount === 2) {
            rightClickCount = 0;
            removeBackground(background);
        }
    });

    backgroundButton.addEventListener('click', function(event) {
        if (event.button === 1) {
            event.preventDefault();
            removeBackground(background);
        } else {
            rightClickCount = 0;

            setNewBackground(background.url);

            let currentSelectedButton = document.querySelector('.background-button.selected');
            if (currentSelectedButton) {
                currentSelectedButton.classList.remove('selected');
            }
            this.classList.add('selected');
        }
    });

    return backgroundButton;
}

const backgroundImage = document.getElementById('background-image');

function setNewBackground(url) {
    backgroundImage.style.backgroundImage = `url(${url})`;
    localStorage.setItem('lastBackground', url);
}

function unsetBackground() {
    backgroundImage.style.backgroundImage = 'none';
    localStorage.setItem('lastBackground', 'none');
}

function loadLastBackground() {
    const lastBackground = localStorage.getItem('lastBackground');

    if (lastBackground) {
        setNewBackground(lastBackground);

        const backgroundButtons = document.querySelectorAll('.background-button');
        backgroundButtons.forEach(button => {
            if (button.style.backgroundImage === `url(${lastBackground})`) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }
}

function removeBackground(background) {
    const index = backgroundButtonsData.indexOf(background);
    if (index !== -1) {
        backgroundButtonsData.splice(index, 1);
        localStorage.setItem('backgrounds', JSON.stringify(backgroundButtonsData));
        createBackgroundButtons();
    }
}

function addNewBackground() {
    const newUrl = document.getElementById('newBackgroundUrl').value;

    try {
        if (validateUrl(newUrl)) { // check if URL is a valid image
            ShowNotification();

            backgroundButtonsData.push({ url: newUrl });
            localStorage.setItem('backgrounds', JSON.stringify(backgroundButtonsData));
            createBackgroundButtons();
            document.getElementById('newBackgroundUrl').value = '';
            toggleMenu('backgroundMenu');
        }
    } catch (err) {
        alert(err);
    }
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', ''); // necessary for Firefox
    event.target.classList.add('dragging');
}

// SETTINGS
const settingsMenu = document.getElementById('settingsMenu');
const searchBar = document.getElementById('search-bar');

function setSearchEngine(engine) {
    searchEngine = engine;
    searchBar.placeholder = 'search with ' + engine;
    localStorage.setItem('searchEngine', engine);
}

// SEARCH
function handleSearch(event) {
    if (event.key === 'Enter') {
        window.location.href = getSearchEngineToUse() + encodeURIComponent(searchBar.value);
    }
}

// MENU
const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const overlay = document.getElementById('overlay');
    const body = document.body;

    if (menu.style.display === 'none') {
        menu.style.display = 'block';
        overlay.style.display = 'block';
        body.classList.add('overlay-active');
    } else {
        menu.style.display = 'none';
        overlay.style.display = 'none';
        body.classList.remove('overlay-active');
    }
}

document.addEventListener('mousemove', function (event) {
    const mouseX = event.clientX;
    const windowWidth = window.innerWidth;
    const leftThreshold = windowWidth > 600 ? (windowWidth > 950 ? 250 : 50) : 50;

    if (mouseX < leftThreshold) {
        if (sidebar.classList.contains("close")) {
            sidebar.classList.remove("close");
        }
    } else {
        if (!sidebar.classList.contains("close")) {
            sidebar.classList.add("close");
        }
    }
});


window.addEventListener('load', function() {
    loadLastBackground();

    const savedSearchEngine = localStorage.getItem('searchEngine');

    if (savedSearchEngine != null)
        setSearchEngine(savedSearchEngine);
});


toast = document.querySelector(".toast");
(closeIcon = document.querySelector(".close")),
  (progress = document.querySelector(".progress"));

let timer1, timer2;

function ShowNotification(title, description) {
    toast.classList.add("active");
    progress.classList.add("active");

    timer1 = setTimeout(() => {
        toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
        progress.classList.remove("active");
    }, 5500);
}

closeIcon.addEventListener("click", () => {
  toast.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
  }, 300);

  clearTimeout(timer1);
  clearTimeout(timer2);
});


document.addEventListener('DOMContentLoaded', function() {
    createBackgroundButtons();
    createShortcutButtons();
    
    document.getElementById('search-bar').addEventListener('keydown', handleSearch);
    document.getElementById('addShortcutButton').addEventListener('click', () => toggleMenu('addShortcutMenu'));
    document.getElementById('backShortcutButton').addEventListener('click', () => toggleMenu('addShortcutMenu'));
    document.getElementById('confirmAddShortcut').addEventListener('click', addNewShortcut);

    document.getElementById('addBackgroundButton').addEventListener('click', () => toggleMenu('backgroundMenu'));
    document.getElementById('backBackgroundButton').addEventListener('click', () => toggleMenu('backgroundMenu'));
    document.getElementById('confirmAddBackground').addEventListener('click', addNewBackground);
    document.getElementById('unsetBackground').addEventListener('click', unsetBackground);

    document.getElementById('clearBackgrounds').addEventListener('click', () => toggleMenu('clearBackgroundMenu'));
    document.getElementById('backClearBackgroundButton').addEventListener('click', () => toggleMenu('clearBackgroundMenu'));
    document.getElementById('confirmClearBackground').addEventListener('click', clearBackgrounds);

    document.getElementById('openSettingsButton').addEventListener('click', () => toggleMenu('settingsMenu'));
    document.getElementById('backSettingsButton').addEventListener('click', () => toggleMenu('settingsMenu'));

    document.getElementById('searchEngineGoogle').addEventListener('click', () => setSearchEngine('google'));
    document.getElementById('searchEngineDuckDuckGo').addEventListener('click', () => setSearchEngine('duckduckgo'));
    document.getElementById('searchEngineQwant').addEventListener('click', () => setSearchEngine('qwant'));

    // dragging
    const sortableList = document.getElementById('side-menu-gallery');

    const initSortableList = (e) => {
        e.preventDefault();

        const draggingItem = sortableList.querySelector(".dragging");

        const siblings = [...sortableList.querySelectorAll(".background-button:not(.dragging)")];

        let nextSibling = siblings.find(sibling => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
        })

        sortableList.insertBefore(draggingItem, nextSibling);
    }

    sortableList.addEventListener("dragover", initSortableList);
    sortableList.addEventListener("dragenter", e => e.preventDefault());
});
