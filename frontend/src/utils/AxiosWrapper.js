import axios from "axios";
import { baseApiURL } from "../baseUrl";

const axiosWrapper = axios.create({
  baseURL: baseApiURL(),
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosWrapper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.data?.message === "Invalid or expired token" &&
      error.response?.data?.success === false
    ) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosWrapper;
