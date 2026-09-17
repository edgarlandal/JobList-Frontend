import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    timeout: 10000
})

api.interceptors.request.use((config) => {
    if (typeof window !== undefined) {
        const token  = sessionStorage.getItem("access_token");

        if (token) config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});

export default api;