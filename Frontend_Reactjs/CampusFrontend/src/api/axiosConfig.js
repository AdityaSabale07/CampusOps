// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const instance = axios.create({
//     baseURL: "http://localhost:8080"
// });

// instance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");

//         if (token) {
//             const decoded = jwtDecode(token);
//             const currentTime = Date.now() / 1000;

//             if (decoded.exp < currentTime) {
//                 // Token expired → logout
//                 localStorage.clear();
//                 window.location.href = "/login";
//                 return;
//             }

//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );



// export default instance;
// axiosConfig.js
// Central axios configuration
// Handles:
// 1️⃣ Attaching JWT token
// 2️⃣ Checking token expiry
// 3️⃣ Auto logout if expired

import axios from "axios";
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
  baseURL: "http://localhost:8080", // 🔥 change if needed
});

// 🔐 Request Interceptor
instance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {

      try {
        // 🔹 Decode token
        const decoded = jwtDecode(token);

        // 🔹 Current time in seconds
        const currentTime = Date.now() / 1000;

        // 🔥 If token expired → logout user
        if (decoded.exp < currentTime) {
          console.log("Token expired. Logging out...");

          localStorage.clear();

          // Redirect to login page
          window.location.href = "/";

          return Promise.reject("Token expired");
        }

        // 🔹 If token valid → attach to header
        config.headers.Authorization = `Bearer ${token}`;

      } catch (error) {
        console.log("Invalid token. Logging out...");
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default instance;
