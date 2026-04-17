import axios from 'axios';

// Assuming API Gateway is at localhost:8080 and proxies requests
const API_URL = 'http://localhost:8080/auth';

const login = async (data) => {
    const response = await axios.post(`${API_URL}/login`, data);
    const { jwt, user } = response.data;
    if (jwt) {
        // Flatten: store token + all user fields together in one object
        const userToStore = { jwt, ...user };
        localStorage.setItem('user', JSON.stringify(userToStore));
        return userToStore;
    }
    return response.data;
};

const signup = async (data) => {
    const response = await axios.post(`${API_URL}/signup`, data);
    const { company } = response.data;
    if (company) {
        // Signup doesn't return JWT; store company info (no token yet)
        localStorage.setItem('user', JSON.stringify({ ...company }));
        return { ...company };
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const updateCompany = async (data) => {
    const user = getCurrentUser();
    const token = user?.jwt || user?.token;

    const response = await axios.put(`${API_URL}/update`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Merge updated fields into existing stored user (preserves jwt)
    const updatedUser = { ...user, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
};

const authService = {
    login,
    signup,
    logout,
    getCurrentUser,
    updateCompany
};

export default authService;
