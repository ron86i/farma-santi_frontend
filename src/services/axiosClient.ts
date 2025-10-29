// axios.ts
import axios, { AxiosError, type AxiosInstance } from "axios";
// Sobrescribimos import.meta.env para que Vitest tenga la URL base
// ;(import.meta as any).env = { VITE_API_URL: 'https://farmasanti-s1.soft-solution.org' };
export const API_URL = import.meta.env.VITE_API_URL ;
export const BASE_URL = API_URL + '/api/shared';

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor de request → agrega Authorization si hay token
apiClient.interceptors.request.use(
  (config) => {
    // const fullUrl = `${config.baseURL}${config.url}`;
    // console.log('Vitest: Axios va a llamar a ->', fullUrl);

    const token = localStorage?.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Si no estamos ya en login
      if (currentPath !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Utilidad para manejar errores de Axios de manera consistente
export function parseAxiosError(err: unknown, fallbackMsg: string) {
  const axiosError = err as AxiosError;
  
  if (axiosError.response?.data && typeof axiosError.response.data === "object") {
    const data = axiosError.response.data as any;
    return {
      status: axiosError.response.status,
      message: data.message || fallbackMsg,
    };
  }

  return {
    status: 500,
    message: fallbackMsg,
  };
}

export default apiClient;
