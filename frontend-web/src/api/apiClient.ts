import axios from 'axios';
import { authStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
