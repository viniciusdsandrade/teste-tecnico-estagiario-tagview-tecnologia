import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000',
    headers: {
        'X-API-KEY': 'tagview-desafio-2024',
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

export default api;
