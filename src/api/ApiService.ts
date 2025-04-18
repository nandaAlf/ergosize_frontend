import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true, // opcional, si usas cookies o autenticación
});

// Interceptores para agregar token si usas JWT
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

const ApiService = {
  get: (url: string, params = {}) => api.get(url, { params }),
  post: (url: string, data: any) => api.post(url, data),
  put: (url: string, data: any) => api.put(url, data),
  delete: (url: string) => api.delete(url),
};

export default ApiService;
