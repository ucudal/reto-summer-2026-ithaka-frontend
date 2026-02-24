import axios, { InternalAxiosRequestConfig } from "axios";
import { env } from "../helpers";

const ithakaApi = axios.create({
  baseURL: `${env.API_URL}/api/v1`,
});

ithakaApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default ithakaApi;
