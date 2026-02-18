// axios.ts
import axios, { AxiosError, type AxiosInstance } from "axios";


const isBrowser = typeof window !== 'undefined';

// @ts-ignore: Le decimos a TS que ignore el error en la siguiente línea
const runtimeEnv = isBrowser ? window.ENV : undefined;

export const API_URL = runtimeEnv?.VITE_API_URL || import.meta.env.VITE_API_URL;
export const BASE_URL = API_URL + '/api/shared';


// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor de request
apiClient.interceptors.request.use(
  (config) => {
    // Solo usamos 'localStorage' si estamos en un navegador
    if (isBrowser) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Solo usamos 'window.location' si estamos en un navegador
    if (isBrowser && error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (currentPath !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Utilidad para manejar errores (sin cambios, ya es universal)
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