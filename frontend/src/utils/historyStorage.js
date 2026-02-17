// LocalStorage utility for managing download history

const HISTORY_KEY = 'tiktok_download_history';
const MAX_HISTORY_ITEMS = 50;

export const historyStorage = {
    // Get all history items
    getHistory: () => {
        try {
            const history = localStorage.getItem(HISTORY_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    },

    // Add new item to history
    addToHistory: (videoData) => {
        try {
            const history = historyStorage.getHistory();

            // Create history item
            const historyItem = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                url: videoData.url || '',
                thumbnail: videoData.data?.video?.thumbnail || '',
                description: videoData.data?.description || 'No description',
                author: {
                    username: videoData.data?.author?.username || 'Unknown',
                    nickname: videoData.data?.author?.nickname || 'Unknown',
                    avatar: videoData.data?.author?.avatar || '',
                },
                stats: videoData.data?.stats || {},
            };

            // Add to beginning of array
            const updatedHistory = [historyItem, ...history];

            // Keep only last MAX_HISTORY_ITEMS
            const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

            // Save to localStorage
            localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));

            return trimmedHistory;
        } catch (error) {
            console.error('Error adding to history:', error);
            return historyStorage.getHistory();
        }
    },

    // Remove item from history
    removeFromHistory: (id) => {
        try {
            const history = historyStorage.getHistory();
            const updatedHistory = history.filter(item => item.id !== id);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        } catch (error) {
            console.error('Error removing from history:', error);
            return historyStorage.getHistory();
        }
    },

    // Clear all history
    clearHistory: () => {
        try {
            localStorage.removeItem(HISTORY_KEY);
            return [];
        } catch (error) {
            console.error('Error clearing history:', error);
            return historyStorage.getHistory();
        }
    },

    // Get history count
    getHistoryCount: () => {
        return historyStorage.getHistory().length;
    },
};
