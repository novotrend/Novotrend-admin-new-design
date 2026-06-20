import axios from "axios";
import { encryptPayload, decryptResponse } from "./crypto";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
        if (token) {
      if (config.method === "get") {
        config.params = {
          ...config.params,
          token,
        };
      } else if (config.data instanceof FormData) {
        config.data.append("token", token);
      } else if (config.data && typeof config.data === "object") {
        config.data = {
          ...config.data,
          token,
        };
      } else {
        config.data = { token };
      }
    }
    if (config.method !== "get") {
      let rawPayload;

      //  UPDATED: FormData handling
      if (config.data instanceof FormData) {
        const originalFormData = config.data;
        const newFormData = new FormData();
        rawPayload = {};

        originalFormData.forEach((value, key) => {
          //  FILE or IMAGE (single + multiple both handle)
          if (value instanceof File || value instanceof Blob) {
            newFormData.append(key, value); // direct send
          } else {
            rawPayload[key] = value;
          }
        });

        // console raw payload
                const encrypted = await encryptPayload(rawPayload);
                // encrypted data add
        newFormData.append("data", encrypted);
        config.data = newFormData;
      }

      // JSON case
      else {
        rawPayload = config.data || {};

                const encrypted = await encryptPayload(rawPayload);
        config.data = { data: encrypted };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  async (response) => {
    try {
      const decrypted = await decryptResponse(response?.data);
      const parsedData = JSON.parse(decrypted);
      response.data = parsedData;

      return response;
    } catch (err) {
      console.error("Decryption failed:", err);
      return response;
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;