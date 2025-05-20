import axios from "axios";

export const BASE =
  import.meta.env.MODE === "development"
    ? "/api/v1"
    : `${import.meta.env.VITE_SERVER_URL}/api/v1`;

export const axiosInstance = axios.create({
  baseURL: BASE,
  withCredentials: true,
});
