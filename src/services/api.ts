// src/services/api.ts
import axios from "axios";
import useAuthStore from "../stores/auth";

export const api = axios.create({
  baseURL: "http://192.168.100.132:3008",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token
api.interceptors.request.use((config: any) => {
  const token = useAuthStore.getState().getDirectusToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
