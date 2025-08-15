// --- CONTROLLER (controller.js) ---
// Connects the model and the view.

import model from './model.js';
import view from './view.js';

/**
 * Handles the logic when a user selects a mood.
 * @param {string} language - The language selected by the user.
 * @param {string} mood - The mood selected by the user.
 */
async function controlMoodSelection(language, mood) {
    try {
        view.renderLoading(true, mood);
        await model.getPlaylist(language, mood);
        view.renderPlaylist(model.state.currentPlaylist, model.state.currentMood);
        view.changeBackground(mood);
    } catch (error) {
        console.error("Failed to load playlist:", error);
        view.renderError("Could not load the playlist. Please try again.");
    }
}

/**
 * Initializes the application.
 */
function init() {
    console.log('Application has started.');
    view.addMoodSelectionHandler(controlMoodSelection);
}

export default {
    init
};
