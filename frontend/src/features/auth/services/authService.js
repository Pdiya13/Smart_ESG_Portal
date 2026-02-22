import axios from 'axios';

// Assuming API Gateway is at localhost:8080 and proxies requests
const API_URL = 'http://localhost:8080/auth';

const login = async (data) => {
    const response = await axios.post(`${API_URL}/login`, data);
    if (response.data.jwt || response.data.token) { // Adjust based on actual response structure
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const signup = async (data) => {
    const response = await axios.post(`${API_URL}/signup`, data);
    if (response.data.jwt || response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    signup,
    logout,
    getCurrentUser,
};

export default authService;
