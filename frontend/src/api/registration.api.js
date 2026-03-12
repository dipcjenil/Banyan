import API from './auth.api';

export const submitRegistration = async (data) => {
    const res = await API.post('/registration/submit', data);
    return res.data;
};

export const getMyRegistration = async () => {
    const res = await API.get('/registration/my');
    return res.data;
};
