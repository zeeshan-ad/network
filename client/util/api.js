import axios from 'axios';
import { BASE_URL } from './constants';
import { store } from '../store/store';


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const axiosInstanceAuth = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor


axiosInstanceAuth.interceptors.request.use(
  (config) => {
    const value = store.getState().userInfo.token;
    config.headers['Authorization'] = `${value}`;
    return config;
  },
  (error) => {
    return error;
  }
);

export default axiosInstanceAuth;




