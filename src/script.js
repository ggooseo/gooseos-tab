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
        console.log(error);
        return [1, { error }];
    }
}

var browser = getBrowserType();
const browserIcon = document.getElementById('browser-icon');
const tabTitle = document.getElementById('tab-title');

const browserIcons = {
    "Firefox": 'images/firefox-icon.png',
    "Opera": 'images/opera-icon.png',
    "Safari": 'images/safari-icon.png',
    "Internet Explorer": 'images/ie-icon.png',
    "Edge": 'images/edge-icon.png',
    "Chrome": 'images/chrome-icon.png',
};

if (browser in browserIcons) {
    browserIcon.src = browserIcons[browser];
    tabTitle.innerText = browser.toLowerCase();
} else {
    tabTitle.innerText = "unknown";
}


// -- Shortcuts


let shortcutButtonsData = JSON.parse(localStorage.getItem('shortcutButtons')) || [];
const shortcutButtonsContainer = document.getElementById('shortcut-buttons');

function createShortcutButtons() {
    shortcutButtonsContainer.innerHTML = '';

    shortcutButtonsData.forEach(button => {
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

        shortcutButtonsContainer.appendChild(shortcutButton);
    });
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


// --Background


let backgroundButtonsData = JSON.parse(localStorage.getItem('backgrounds')) || [];
const backgroundGalleryContainer = document.getElementById('side-menu-gallery');


function createBackgroundButtons() {
    backgroundGalleryContainer.innerHTML = '';
    
    backgroundButtonsData.forEach(background => {
        const backgroundButton = document.createElement('bg-image');
        backgroundButton.classList.add('background-button');
        backgroundButton.style.backgroundImage = `url(${background.url})`;
        backgroundButton.setAttribute("draggable", 'true');

        // add listner for when to start and end dragging
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
    
    backgroundGalleryContainer.appendChild(backgroundButton);
    });
}


function setNewBackground(url) {
    const backgroundImage = document.getElementById('background-image');
    backgroundImage.style.backgroundImage = `url(${url})`;
    localStorage.setItem('lastBackground', url);
}

function loadLastBackground() {
    // Retrieve the last used background URL from local storage
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

    try{
        if (validateUrl(newUrl)) { // check if URL is valid image
            backgroundButtonsData.push({ url: newUrl });
            localStorage.setItem('backgrounds', JSON.stringify(backgroundButtonsData));
            createBackgroundButtons();
            document.getElementById('newBackgroundUrl').value = '';
            toggleMenu('backgroundMenu');
        } 
    } catch(err) {
        alert(err);
    }
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', '');  // necessary for Firefox
    event.target.classList.add('dragging');
}

// SEARCH
function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('search-bar').value;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
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
    const leftThreshold = 250;

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

window.addEventListener('load', function () {
    loadLastBackground();
});

document.getElementById('search-bar').addEventListener('keydown', handleSearch);

document.addEventListener('DOMContentLoaded', function () {
    createBackgroundButtons();
    createShortcutButtons();

    document.getElementById('addShortcutButton').addEventListener('click', () => toggleMenu('addShortcutMenu'));
    document.getElementById('backShortcutButton').addEventListener('click', () => toggleMenu('addShortcutMenu'));
    document.getElementById('confirmAddShortcut').addEventListener('click', addNewShortcut);
    
    document.getElementById('addBackgroundButton').addEventListener('click', () => toggleMenu('backgroundMenu'));
    document.getElementById('backBackgroundButton').addEventListener('click', () => toggleMenu('backgroundMenu'));
    document.getElementById('confirmAddBackground').addEventListener('click', addNewBackground);    

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
