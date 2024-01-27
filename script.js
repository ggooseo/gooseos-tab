function getBrowserType() {
    const test = regexp => {
      return regexp.test(navigator.userAgent);
    };
  
    console.log(navigator.userAgent);
  
    if (test(/opr\//i) || !!window.opr) {
      return 'Opera';
    } else if (test(/edg/i)) {
      return 'Microsoft Edge';
    } else if (test(/chrome|chromium|crios/i)) {
      return 'Google Chrome';
    } else if (test(/firefox|fxios/i)) {
      return 'Mozilla Firefox';
    } else if (test(/safari/i)) {
      return 'Apple Safari';
    } else if (test(/trident/i)) {
      return 'Microsoft Internet Explorer';
    } else if (test(/ucbrowser/i)) {
      return 'UC Browser';
    } else if (test(/samsungbrowser/i)) {
      return 'Samsung Browser';
    } else {
      return 'Unknown browser';
    }
  }

var browser = getBrowserType();
const browserIcon = document.getElementById('browser-icon');
const tabTitle = document.getElementById('tab-title');

if (browser == "Mozilla Firefox") {
    browserIcon.src = 'src/images/firefox-icon.png';
    tabTitle.innerText = "firefox";
} else if (browser == "Opera") {
    browserIcon.src = 'src/images/opera-icon.png'; 
    tabTitle.innerText = "opera";
} else if (browser == "Apple Safari") {
    browserIcon.src = 'src/images/safari-icon.png'; 
    tabTitle.innerText = "safari";
} else if (browser == "Microsoft INternet Explorer") {
    browserIcon.src = 'src/images/ie-icon.png';
    tabTitle.innerText = "internet explorer?";
} else if (browser == "Microsoft Edge") {
    browserIcon.src = 'src/images/edge-icon.png'; 
    tabTitle.innerText = "edge";
} else if (browser == "Google Chrome") {
    browserIcon.src = 'src/images/chrome-icon.png';
    tabTitle.innerText = "chrome";
} else {
    tabTitle.innerText = "unknown";
}


// -- Shortcuts


let shortcutButtonsData = JSON.parse(localStorage.getItem('shortcutButtons')) || [];

function createShortcutButtons() {
    const shortcutButtonsContainer = document.getElementById('shortcut-buttons');

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
            if (event.button === 1) { // Middle click
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
function toggleAddShortcutMenu() {
    const addShortcutMenu = document.getElementById('addShortcutMenu');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    if (addShortcutMenu.style.display === 'none') {
        addShortcutMenu.style.display = 'block';
        overlay.style.display = 'block';
        body.classList.add('overlay-active');
    } else {
        addShortcutMenu.style.display = 'none';
        overlay.style.display = 'none';
        body.classList.remove('overlay-active');
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
    toggleAddShortcutMenu();
}


// --Background


let backgroundButtonsData = JSON.parse(localStorage.getItem('backgrounds')) || [];

function createBackgroundButtons() {
    const backgroundGalleryContainer = document.getElementById('background-gallery');

    backgroundGalleryContainer.innerHTML = '';

    backgroundButtonsData.forEach(background => {
        const backgroundButton = document.createElement('button');
        backgroundButton.style.backgroundImage = `url(${background.url})`;
        backgroundButton.classList.add('background-button');

        backgroundButton.addEventListener('click', function() {
            setNewBackground(background.url);
        });

        backgroundGalleryContainer.appendChild(backgroundButton);
    });
}

function setNewBackground(url) {
    const backgroundImage = document.getElementById('background-image');
    backgroundImage.style.backgroundImage = `url(${url})`;
}

function removebackground(background) {
    const index = backgroundButtonsData.indexOf(background);
    if (index !== -1) {
        backgroundButtonsData.splice(index, 1);
        localStorage.setItem('backgrounds', JSON.stringify(backgroundButtonsData));
        createBackgroundButtons();
    }
}
function toggleAddBackgroundMenu() {
    const backgroundMenu = document.getElementById('backgroundMenu');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    if (backgroundMenu.style.display === 'none') {
        backgroundMenu.style.display = 'block';
        overlay.style.display = 'block';
        body.classList.add('overlay-active');
    } else {
        backgroundMenu.style.display = 'none';
        overlay.style.display = 'none';
        body.classList.remove('overlay-active');
    }
}

function addNewBackground() {
    const newUrl = document.getElementById('newBackgroundUrl').value;

    backgroundButtonsData.push({ name: newName, url: newUrl });

    localStorage.setItem('backgrounds', JSON.stringify(backgroundButtonsData));

    createBackgroundButtons();

    document.getElementById('newBackgroundUrl').value = '';
    toggleAddBackgroundMenu();
}

window.addEventListener('load', createBackgroundButtons);
window.addEventListener('load', createShortcutButtons);

function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('search-bar').value;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    }
}

// MENU
const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");

document.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX;

    // Set a threshold (e.g., 50 pixels) to determine the left side
    const leftThreshold = 350;

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

// Get parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const imageURL = urlParams.get('v');

if (imageURL) {
    const backgroundImage = document.getElementById('background-image');
    backgroundImage.style.backgroundImage = `url(${decodeURIComponent(imageURL)})`;
}

document.addEventListener('DOMContentLoaded', function () {
    createShortcutButtons();
    document.getElementById('addShortcutButton').addEventListener('click', toggleAddShortcutMenu);
    document.getElementById('backShortcutButton').addEventListener('click', toggleAddShortcutMenu);
    document.getElementById('confirmAddShortcut').addEventListener('click', addNewShortcut);

    document.getElementById('addBackgroundButton').addEventListener('click', toggleAddBackgroundMenu);
    document.getElementById('backBackgroundButton').addEventListener('click', toggleAddBackgroundMenu);
    document.getElementById('confirmAddBackground').addEventListener('click', addNewBackground);
});
