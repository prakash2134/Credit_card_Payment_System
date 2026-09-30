import axios from "axios";

export const djangoApi = axios.create({
  baseURL: import.meta.env.VITE_DJANGO_API_URL || "http://localhost:8000/api",
});

export const fastApi = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL || "http://localhost:8001/api",
});

function attachAuth(instance) {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

attachAuth(djangoApi);
attachAuth(fastApi);
