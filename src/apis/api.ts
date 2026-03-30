import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request intercepter
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 這裡通常會去拿 Token
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response intercepter
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.error('登入失敗，請重新登入');
        // window.location.href = '/login';
      } else if (status === 500) {
        console.error('伺服器發生異常，請稍後再試');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('請求超時，請檢查網路狀態');
    } else if (axios.isCancel(error)) {
      console.error('請求已取消');
    } else {
      console.error('網路連線異常');
    }
    return Promise.reject(error);
  },
);

export default api;
