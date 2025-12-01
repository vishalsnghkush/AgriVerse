import axios from 'axios';
// changes added
const API_BASE_URL = ""; // Relative path for production

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    },
    register: async (username, password, fullName, location) => {
        return await api.post('/auth/register', { username, password, full_name: fullName, location });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getUser: () => {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    }
};

export const fetchWeather = async (lat, lon) => {
    try {
        const res = await api.get('/api/weather', { params: { lat, lon } });
        return res.data;
    } catch (error) {
        console.error("Weather API Error:", error);
        return null;
    }
};

export const fetchSoil = async (lat, lon) => {
    try {
        const res = await api.get('/api/soil', { params: { lat, lon } });
        return res.data;
    } catch (error) {
        console.error("Soil API Error:", error);
        return null;
    }
};

export const getIrrigationRecommendation = async (crop, moisture, rainfall) => {
    try {
        const res = await api.post('/api/irrigation', { crop, soil_moisture: moisture, rainfall });
        return res.data;
    } catch (error) {
        console.error("Irrigation API Error:", error);
        return null;
    }
};

export const getYieldPrediction = async (crop) => {
    try {
        const res = await api.post('/api/yield', { crop });
        return res.data;
    } catch (error) {
        console.error("Yield API Error:", error);
        return null;
    }
};

export const fetchAllUsers = async () => {
    try {
        const res = await api.get('/api/admin/users');
        return res.data;
    } catch (error) {
        console.error("Admin API Error:", error);
        return [];
    }
};

export const searchCity = async (city) => {
    try {
        const res = await api.get('/api/geocode', { params: { city } });
        return res.data;
    } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
    }
};

export const fetchMarketPrices = async () => {
    try {
        const res = await api.get('/api/market');
        return res.data;
    } catch (error) {
        console.error("Market API Error:", error);
        return [];
    }
};

export const predictDisease = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await api.post('/predict', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    } catch (error) {
        console.error("Prediction Error:", error);
        return null;
    }
};
