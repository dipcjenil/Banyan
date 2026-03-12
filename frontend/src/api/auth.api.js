import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export const signupInit = async (email, password) => {
    const res = await API.post('/auth/signup-init', { email, password });
    return res.data;
};

export const loginInit = async (email, password) => {
    const res = await API.post('/auth/login-init', { email, password });
    return res.data;
};

export const verifyOTP = async (email, code) => {
    const res = await API.post('/auth/verify-otp', { email, code });
    return res.data;
};

export const logoutUser = async () => {
    const res = await API.post('/auth/logout');
    return res.data;
};

export const getMe = async () => {
    const res = await API.get('/auth/me');
    return res.data;
};

export const getStats = async () => {
    const res = await API.get('/auth/stats');
    return res.data;
};

export const getRegistrations = async () => {
    const res = await API.get('/auth/registrations');
    return res.data;
};

export default API;
