import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de respuesta para normalizar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Error desconocido en la API';

    return Promise.reject({
      status: error.response?.status,
      mensaje,
      original: error,
    });
  }
);