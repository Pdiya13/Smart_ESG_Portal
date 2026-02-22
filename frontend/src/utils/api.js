import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Request interceptor to add the JWT token to headers if it exists
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const token = user.jwt || user.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error("Error parsing user from local storage", e);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
