import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure this is defined in your .env file
  headers: {
    "Accept": "application/json",
  },
});

export default axiosInstance;
