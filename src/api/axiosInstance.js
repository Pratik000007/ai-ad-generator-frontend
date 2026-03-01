import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 🛑 Optimization: If there's no token, don't even try for protected routes
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/forbidden tokens globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 = Unauthorized (Token expired/Invalid)
    // 403 = Forbidden (No permission or Session ended)
    if (status === 401 || status === 403) {
      // Only redirect if we aren't already on the login page
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role"); // Clean up everything
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;