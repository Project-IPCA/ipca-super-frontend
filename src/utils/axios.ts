import axios from "axios";

const VITE_IPCA_API = import.meta.env.VITE_IPCA_API;

const axiosInstance = axios.create({
  baseURL: VITE_IPCA_API,
});

// NOTE: To test skeleton uncomment it!
// axiosInstance.interceptors.request.use(
//   async function (config) {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   },
// );

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${VITE_IPCA_API}/auth/refresh_token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          );
          if (response.status === 200) {
            localStorage.setItem("access_token", response.data.accessToken);
            localStorage.setItem("refresh_token", response.data.refreshToken);

            originalRequest.headers["Authorization"] =
              `Bearer ${response.data.accessToken}`;

            return axiosInstance(originalRequest);
          }
        } catch (err) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          window.location.reload();
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
