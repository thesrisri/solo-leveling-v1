import axios from "axios";

const api = axios.create({
  baseURL: "https://solo-leveling-v1.onrender.com",
  withCredentials: true,
});

export default api;