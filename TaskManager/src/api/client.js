import axios from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { getToken, removeToken } from '../utils/storage';

const baseURL = Config.API_URL || Platform.select({
  android: 'http://10.0.2.2:5001/api',
  ios: 'http://localhost:5001/api',
  default: 'http://localhost:5001/api',
});

const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach Authorization header
client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  },
);

export default client;
