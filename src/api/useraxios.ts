// import axios from "axios";

// export const useraxiosInstance = await axios.create({
//     baseURL:'http://localhost:5000/api',
//     timeout:10000,
//         headers:{
//             "Content-Type":"application/json"
//         }    
//     })


// import axios, { AxiosInstance } from "axios";

// const userAxiosInstance: AxiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach token to every request
// userAxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default userAxiosInstance;
// import axios, { AxiosInstance, AxiosError } from "axios";

// const userAxiosInstance: AxiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials:true
// });


// // Attach token to every request
// userAxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle token removal on 401 Unauthorized response
// userAxiosInstance.interceptors.response.use(
//   (response) => 
    
//     response,
//   (error: AxiosError) => {
    
//     if (error.response?.status === 401|| error.response?.status === 403) {
//       console.warn("Invalid token detected. Removing token...");
//       localStorage.removeItem("authToken");
//       window.location.href = "/login"; // Redirect to login page
//     }
//     return Promise.reject(error);
//   }
  
// );

// export default userAxiosInstance;
import Swal from "sweetalert2";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const userAxiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Refresh token function
const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get<{ token: string }>(
      `${import.meta.env.VITE_BASE_URL}/user/refresh-token`,
      { withCredentials: true }
    );
    const newToken = response.data.token;
    localStorage.setItem("authToken", newToken);
    return newToken;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
};

// Correct interceptor using InternalAxiosRequestConfig
userAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
let isRefreshing = false
// Refresh token on unauthorized
userAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log(error,'error from axios');
    if (!isRefreshing && error.response?.status === 403 ){
      Swal.fire({
                    title: "User Blocked!",
                    text: "You are blocked",
                    icon: "error",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "OK",
                  }).then(() => {
        localStorage.removeItem("authToken")
        window.location.href = "/login"})
    }
    if (!isRefreshing && error.response?.status === 401 ) {
      console.warn("Access token expired, attempting to refresh...");
      isRefreshing = true
      const newToken = await refreshToken();
      isRefreshing = false
      if (newToken) {
        const originalRequest = error.config as InternalAxiosRequestConfig;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return userAxiosInstance(originalRequest);
      } else {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default userAxiosInstance;
