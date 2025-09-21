/* eslint-disable @typescript-eslint/no-explicit-any */
// services/ApiService.ts

import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api' ;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Extendemos InternalAxiosRequestConfig para añadir _retry
type RequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// —–– Interceptor de petición: añade Authorization si hay token
api.interceptors.request.use((config: RequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// —–– Interceptor de respuesta: si recibimos 401 y hay refresh, intentamos refrescar
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
          const newAccess = data.access;
          // guardamos nuevo access
          localStorage.setItem('access_token', newAccess);
          // reintentar la petición original con el nuevo token
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          }
          return api(originalRequest);
        } catch {
          // el refresh falló: forzamos logout
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// —–– Métodos públicos
const ApiService = {
  get: (url: string, params: any = {}, config: AxiosRequestConfig = {}) =>
    api.get(url, { params, ...config }),

  post: (url: string, data: any, config: AxiosRequestConfig = {}) =>
    api.post(url, data, config),

  put: (url: string, data: any, config: AxiosRequestConfig = {}) =>
    api.put(url, data, config),

  patch: (url: string, data: any, config: AxiosRequestConfig = {}) =>
    api.put(url, data, config),

  delete: (url: string, config: AxiosRequestConfig = {}) =>
    api.delete(url, config),

  // Métodos de auth:
  login: (username: string, password: string) =>
    api.post('/token/', { username, password }).then(res => {
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      return res;
    }),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Opcional: helper para saber si el token está expirado
  isAccessTokenExpired: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },
};

export default ApiService;
