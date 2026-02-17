import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const downloadTikTokVideo = async (url) => {
    try {
        const response = await api.post('/tiktok/download', { url });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Network Error', message: 'Failed to connect to server' };
    }
};

export default api;
