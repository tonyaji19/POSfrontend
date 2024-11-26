import axios from "axios";

// Konfigurasi dasar untuk semua request API
const api = axios.create({
  baseURL: "https://localhost:7050/api", // Base URL API Anda
  timeout: 300000, // Timeout 10 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token JWT jika tersedia
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // Ambil token dari localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Tambahkan header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
