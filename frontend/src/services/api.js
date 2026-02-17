import axios from 'axios';

// Smart API URL detection
const getApiUrl = () => {
    // 1. If VITE_API_URL is set (custom backend), use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 2. If in production (Vercel), use relative path (same domain)
    if (import.meta.env.PROD) {
        return '/api';
    }

    // 3. Default to localhost for development
    return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const downloadTikTokVideo = async (url) => {
    try {
        const response = await api.post('/tiktok-download', { url });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Network Error', message: 'Failed to connect to server' };
    }
};

export default api;
