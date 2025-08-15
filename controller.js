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
        // 1. Tell the view to show a loading state
        view.renderLoading(true, mood);
        
        // 2. Asynchronously fetch the playlist from the model using language and mood
        await model.getPlaylist(language, mood);
        
        // 3. Render the new playlist in the view using the fetched data from the model
        view.renderPlaylist(model.state.currentPlaylist, model.state.currentMood);
        
        // 4. Change the background in the view
        view.changeBackground(mood);

    } catch (error) {
        // If the API call fails, render an error message.
        console.error("Failed to load playlist:", error);
        view.renderError("Could not load the playlist. Please try again.");
    }
}

/**
 * Initializes the application.
 */
function init() {
    console.log('Application has started.');
    // Set up the event listeners. The view will now pass both language and mood.
    view.addMoodSelectionHandler(controlMoodSelection);
}

// Export the public functions
export default {
    init
};
