// --- VIEW (view.js) ---
// Manages all DOM interactions and rendering.

const uiStrings = {
    findingSongs: (mood, lang) => `Finding ${lang} ${mood} Songs...`,
    playlistTitle: (mood, lang) => `${lang} ${mood} Playlist`,
    errorTitle: 'Something Went Wrong',
    noSongsFound: 'No songs found for this mood and language.',
};

const elements = {
    body: document.body,
    moodCards: document.querySelectorAll('.mood-card'),
    playlistContainer: document.querySelector('.playlist-container'),
    playlistTitle: document.getElementById('playlist-title'),
    playlistList: document.querySelector('.playlist'),
    languageSelect: document.getElementById('language-select') // New element
};

function createSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loader';
    return spinner;
}

function renderLoading(isLoading, mood) {
    elements.playlistList.innerHTML = '';
    
    if (isLoading) {
        const lang = elements.languageSelect.options[elements.languageSelect.selectedIndex].text;
        const moodText = mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : '';
        elements.playlistContainer.style.display = 'block';
        elements.playlistTitle.textContent = uiStrings.findingSongs(moodText, lang);
        elements.playlistList.appendChild(createSpinner());
    }
}

function renderError(message) {
    elements.playlistContainer.style.display = 'block';
    elements.playlistTitle.textContent = uiStrings.errorTitle;
    elements.playlistList.innerHTML = `<li class="error-message">${message}</li>`;
}

function renderPlaylist(playlist, mood) {
    const lang = elements.languageSelect.options[elements.languageSelect.selectedIndex].text;
    const capitalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1);
    elements.playlistContainer.style.display = 'block';
    elements.playlistTitle.textContent = uiStrings.playlistTitle(capitalizedMood, lang);

    if (playlist.length === 0) {
        elements.playlistList.innerHTML = `<li>${uiStrings.noSongsFound}</li>`;
        return;
    }

    const playlistHtml = playlist.map((song, index) => `
        <li class="song-item">
            <a href="${song.link}" target="_blank" rel="noopener noreferrer">
                <span class="song-number">${index + 1}</span>
                <div class="song-details">
                    <div class="title">${song.title}</div>
                    <div class="artist">${song.artist}</div>
                </div>
            </a>
        </li>
    `).join('');

    elements.playlistList.innerHTML = playlistHtml;
}

function changeBackground(mood) {
    elements.body.className = '';
    elements.body.classList.add(`${mood}-bg`);
}

function addMoodSelectionHandler(handler) {
    elements.moodCards.forEach(card => {
        card.addEventListener('click', () => {
            const mood = card.dataset.mood;
            const language = elements.languageSelect.value; // Get current language
            handler(language, mood);
        });
    });
}

export default {
    renderPlaylist,
    changeBackground,
    addMoodSelectionHandler,
    renderLoading,
    renderError
};
