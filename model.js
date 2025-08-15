// --- MODEL (model.js) ---
// Manages the application's data by fetching from the YouTube API.

const state = {
    currentMood: null,
    currentLanguage: null,
    currentPlaylist: [],
};

// IMPORTANT: Replace this with your actual YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyAb5CwHSk1Rd161tKcGjPdG1-v0UqzNGQM';

/**
 * Fetches a playlist from YouTube based on language and mood.
 * @param {string} language - The selected language (e.g., 'english', 'hindi').
 * @param {string} mood - The selected mood (e.g., 'happy', 'sad').
 */
async function getPlaylist(language, mood) {
    // 1. Create a search query for the API.
    // This combines the parameters to find a relevant playlist on YouTube.
    const searchQuery = `${language} ${mood} songs playlist`;
    
    // 2. Construct the API request URL.
    // - `part=snippet`: We only need the basic video details.
    // - `maxResults=10`: We want to fetch 10 songs.
    // - `q=...`: The search term we created.
    // - `type=video`: We only want video results, not channels or playlists.
    // - `key=...`: Your API key.
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`;

    try {
        // 3. Make the API call using fetch.
        const response = await fetch(apiUrl);
        if (!response.ok) {
            // If the response is not successful (e.g., 403 Forbidden for bad API key), throw an error.
            throw new Error(`YouTube API error! Status: ${response.status}`);
        }
        const data = await response.json();

        // 4. Transform the API data into the format our application expects.
        // The YouTube API returns a complex object; we extract what we need.
        const playlist = data.items.map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle, // Using channel title as the artist
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        // 5. Update the application's state with the new data.
        state.currentLanguage = language;
        state.currentMood = mood;
        state.currentPlaylist = playlist;

    } catch (error) {
        console.error("Failed to fetch playlist from YouTube:", error);
        // In case of an error, reset the playlist and re-throw the error
        // so the controller can catch it and display an error message to the user.
        state.currentPlaylist = [];
        throw error;
    }
}

export default {
    state,
    getPlaylist
};
