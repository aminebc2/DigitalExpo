import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

// Set up axios instance with default headers
const api = axios.create();

// Add token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (loginRequest) => {
    try {
        console.log('Attempting login with:', loginRequest);
        const response = await api.post(`${API_URL}/login`, loginRequest);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message || 'Login failed');
        }
        throw new Error('Network error. Please try again later.');
    }
};

export const registerUser = async (registerRequest) => {
    try {
        const response = await api.post(`${API_URL}/register`, registerRequest);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        }
        throw new Error('Network error. Please try again later.');
    }
};