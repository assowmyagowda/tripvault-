import axios from "axios";

const api = axios.create({
  baseURL: "https://tripvault-c1b6.onrender.com/api",
});

export default api;