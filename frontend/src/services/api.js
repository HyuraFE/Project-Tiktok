import axios from 'axios';

// Smart API URL detection
const getApiUrl = () => {
    // 1. If VITE_API_URL is set (custom backend), use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // 2. Always use relative path so browser requests go to the current host/port
    // In dev mode, Vite proxy will forward /api to http://localhost:5000
    // In production (Vercel), Vercel serverless /api will handle it
    return '/api';
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
