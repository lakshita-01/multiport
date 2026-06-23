import axios from 'axios';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/+$/, '');

const api = axios.create({ baseURL: `${BACKEND_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('multivista_auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
