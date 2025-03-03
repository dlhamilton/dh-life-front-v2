import axios from "axios";

// const API_URL = "http://localhost:8000/api/";
const API_URL = "https://8000-dlhamilton-dhlifev2-kew0vzovir0.ws-eu118.gitpod.io/";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Token ${user.token}`;
  }
  return config;
});