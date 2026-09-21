import axios from "axios";

// Next.js forwards requests to the backend configured in .env.
const api = axios.create({ baseURL: "/api/", timeout: 15_000 });
export default api;
