// --- MODEL (model.js) ---
// Manages the application's data by fetching from the YouTube API, with a local fallback.

// This safely checks for the Vercel environment variable.
// If it doesn't exist (e.g., running locally), it defaults to null without crashing.
const YOUTUBE_API_KEY = import.meta.env ? import.meta.env.VITE_YOUTUBE_API_KEY : null;

const state = {
    currentMood: null,
    currentLanguage: null,
    currentPlaylist: [],
};

// --- Fallback Data ---
// This local database is used if the YouTube API is unavailable or the key is missing.
const localSongDatabase = {
    english: {
        happy: [
            { title: "Happy", artist: "Pharrell Williams", link: "https://www.youtube.com/watch?v=y6Sxv-sUYtM" },
            { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", link: "https://www.youtube.com/watch?v=OPf0YbXqDm0" },
            { title: "Walking on Sunshine", artist: "Katrina & The Waves", link: "https://www.youtube.com/watch?v=iPUmE-tne5U" },
            { title: "Don't Stop Me Now", artist: "Queen", link: "https://www.youtube.com/watch?v=HgzGwKwLmgM" },
            { title: "Lovely Day", artist: "Bill Withers", link: "https://www.youtube.com/watch?v=bEeaS6fuUoA" }
        ],
        sad: [
            { title: "Someone Like You", artist: "Adele", link: "https://www.youtube.com/watch?v=hLQl3WQQoQ0" },
            { title: "Fix You", artist: "Coldplay", link: "https://www.youtube.com/watch?v=k4V3Mo61fJM" },
            { title: "Hallelujah", artist: "Jeff Buckley", link: "https://www.youtube.com/watch?v=y8AWFf7EAc4" },
            { title: "Everybody Hurts", artist: "R.E.M.", link: "https://www.youtube.com/watch?v=5rOiW_xY-kc" },
            { title: "Skinny Love", artist: "Bon Iver", link: "https://www.youtube.com/watch?v=ssdgFoHLwnk" }
        ],
        energetic: [
            { title: "Thunderstruck", artist: "AC/DC", link: "https://www.youtube.com/watch?v=v2AC41dglnM" },
            { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", link: "https://www.youtube.com/watch?v=2zNSgSzhBfM" },
            { title: "Mr. Brightside", artist: "The Killers", link: "https://www.youtube.com/watch?v=gGdGFtwCNBE" },
            { title: "Hey Ya!", artist: "OutKast", link: "https://www.youtube.com/watch?v=PWgvGjAhvIw" },
            { title: "Dog Days Are Over", artist: "Florence + The Machine", link: "https://www.youtube.com/watch?v=iWOA-GfAstM" }
        ],
        chill: [
            { title: "Better Together", artist: "Jack Johnson", link: "https://www.youtube.com/watch?v=u57d4_b_YgI" },
            { title: "Sunday Morning", artist: "Maroon 5", link: "https://www.youtube.com/watch?v=S2Cti12XBw4" },
            { title: "Fast Car", artist: "Tracy Chapman", link: "https://www.youtube.com/watch?v=AIOAlaACuv4" },
            { title: "Here Comes The Sun", artist: "The Beatles", link: "https://www.youtube.com/watch?v=GKdl-j0bFfI" },
            { title: "Weightless", artist: "Marconi Union", link: "https://www.youtube.com/watch?v=UfcAVejslrU" }
        ],
        romantic: [
            { title: "Perfect", artist: "Ed Sheeran", link: "https://www.youtube.com/watch?v=2Vv-BfVoq4g" },
            { title: "Thinking Out Loud", artist: "Ed Sheeran", link: "https://www.youtube.com/watch?v=lp-EO5I60KA" },
            { title: "All of Me", artist: "John Legend", link: "https://www.youtube.com/watch?v=450p7goxZqg" },
            { title: "A Thousand Years", artist: "Christina Perri", link: "https://www.youtube.com/watch?v=rtOvBOTyX00" },
            { title: "Can't Help Falling in Love", artist: "Elvis Presley", link: "https://www.youtube.com/watch?v=vGJTaP6anOU" }
        ],
        workout: [
            { title: "Till I Collapse", artist: "Eminem", link: "https://www.youtube.com/watch?v=ytQ5CYE1VZw" },
            { title: "Lose Yourself", artist: "Eminem", link: "https://www.youtube.com/watch?v=_Yhyp-_hX2s" },
            { title: "Stronger", artist: "Kanye West", link: "https://www.youtube.com/watch?v=PsO6ZnUZI0g" },
            { title: "POWER", artist: "Kanye West", link: "https://www.youtube.com/watch?v=L53gjP-TtGE" },
            { title: "Welcome to the Jungle", artist: "Guns N' Roses", link: "https://www.youtube.com/watch?v=o1tj2zJ2Wvg" }
        ]
    },
    hindi: {
        happy: [
            { title: "Badtameez Dil", artist: "Benny Dayal", link: "https://www.youtube.com/watch?v=II2EO3Nw4m0" },
            { title: "Kala Chashma", artist: "Amar Arshi, Badshah, Neha Kakkar", link: "https://www.youtube.com/watch?v=k4yXQkG2s1E" }
        ],
        sad: [
            { title: "Channa Mereya", artist: "Arijit Singh", link: "https://www.youtube.com/watch?v=bzSTpdcs-EI" },
            { title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh", link: "https://www.youtube.com/watch?v=xRb8hxwN5zc" }
        ],
        romantic: [
            { title: "Tum Hi Ho", artist: "Arijit Singh", link: "https://www.youtube.com/watch?v=Umqb9KENgmk" },
            { title: "Raabta", artist: "Arijit Singh", link: "https://www.youtube.com/watch?v=zlt3hI0r9pA" }
        ]
    },
    spanish: {
        happy: [
            { title: "Bailando", artist: "Enrique Iglesias", link: "https://www.youtube.com/watch?v=NUsoVlDFqZg" },
            { title: "Vivir Mi Vida", artist: "Marc Anthony", link: "https://www.youtube.com/watch?v=YXnjy5YlDwk" }
        ],
        energetic: [
            { title: "Danza Kuduro", artist: "Don Omar", link: "https://www.youtube.com/watch?v=7zp1TbLFPp8" },
            { title: "Gasolina", artist: "Daddy Yankee", link: "https://www.youtube.com/watch?v=qGKrc3A6HHM" }
        ]
    }
};

/**
 * Loads a playlist from the local fallback database.
 * @param {string} language - The selected language.
 * @param {string} mood - The selected mood.
 */
function loadFromFallback(language, mood) {
    console.warn("Loading playlist from local fallback data.");
    if (localSongDatabase[language] && localSongDatabase[language][mood]) {
        state.currentPlaylist = localSongDatabase[language][mood];
    } else {
        state.currentPlaylist = [{ title: "Fallback song not found", artist: "Please check local database", link: "#" }];
    }
    state.currentLanguage = language;
    state.currentMood = mood;
}


/**
 * Fetches a playlist from YouTube based on language and mood.
 * @param {string} language - The selected language (e.g., 'english', 'hindi').
 * @param {string} mood - The selected mood (e.g., 'happy', 'sad').
 */
async function getPlaylist(language, mood) {
    // If there's no API key (running locally), immediately use the fallback.
    if (!YOUTUBE_API_KEY) {
        console.error("API Key not found. Loading from local fallback.");
        loadFromFallback(language, mood);
        return; 
    }

    const searchQuery = `${language} ${mood} songs playlist`;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            // If the error is specifically a 403 (Forbidden), it's likely a quota issue.
            if (response.status === 403) {
                loadFromFallback(language, mood);
                return; // Exit and use fallback data
            }
            const errorData = await response.json();
            throw new Error(`YouTube API error! Status: ${response.status}. Message: ${errorData.error.message}`);
        }
        
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            console.warn('API returned 0 items. Using fallback.');
            loadFromFallback(language, mood);
        } else {
            const playlist = data.items.map(item => ({
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                link: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
            state.currentPlaylist = playlist;
            state.currentLanguage = language;
            state.currentMood = mood;
        }

    } catch (error) {
        console.error("An error occurred fetching from YouTube. Using fallback.", error);
        loadFromFallback(language, mood); // Use fallback on any other fetch-related error
    }
}

export default {
    state,
    getPlaylist
};
