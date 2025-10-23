import axios, {
    AxiosHeaders,
    type InternalAxiosRequestConfig,

} from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000', /* TODO: hardcoded: retirar quando for para produção */

    timeout: 15000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const key = 'tagview-desafio-2024'; /* TODO: hardcoded: retirar quando for para produção */

    if (!config.headers) {
        config.headers = new AxiosHeaders();
    }

    config.headers.set('X-API-KEY', key);
    if (!config.headers.has('Content-Type')) {
        config.headers.set('Content-Type', 'application/json');
    }

    return config;
});

export default api;
