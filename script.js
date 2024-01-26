let shortcutButtonsData = JSON.parse(localStorage.getItem('shortcutButtons')) || [];

function createShortcutButtons() {
    const shortcutButtonsContainer = document.getElementById('shortcut-buttons');

    shortcutButtonsContainer.innerHTML = '';

    shortcutButtonsData.forEach(button => {
        const shortcutButton = document.createElement('a');
        shortcutButton.href = button.url.startsWith('http') ? button.url : 'https://' + button.url;
        shortcutButton.textContent = button.name;
        shortcutButton.classList.add('shortcut-button');

        shortcutButton.addEventListener('click', function(event) {
            window.location.href = shortcutButton.href;
        });

        shortcutButtonsContainer.appendChild(shortcutButton);
    });
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

window.addEventListener('load', createShortcutButtons);

function handleSearch(event) {
    if (event.key === 'Enter') {
        const searchTerm = document.getElementById('search-bar').value;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    }
}
