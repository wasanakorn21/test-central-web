import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Resolve base API URL from public env for client usage or fallback.
const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

// Create a singleton axios instance.
const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional request interceptor (e.g., attach auth token later).
apiClient.interceptors.request.use((config) => {
  // Example: const token = getTokenFromStore(); if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to normalize errors.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // You can centralize logging or transform the error here
    return Promise.reject(error);
  }
);

export interface ApiErrorShape {
  status: number;
  message: string;
  details?: any;
}

export async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res: AxiosResponse<T> = await apiClient.request<T>(config);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function post(url: string, data?: any): Promise<any> {
  return await request({
    url,
    method: "POST",
    data,
  });
}

export async function get(url: string): Promise<any> {
  return await request({
    url,
    method: "GET",
  });
}

export function normalizeError(err: unknown): ApiErrorShape {
  if (axios.isAxiosError(err)) {
    return {
      status: err.response?.status || 0,
      message:
        (err.response?.data as any)?.error || err.message || "Unexpected error",
      details: err.response?.data,
    };
  }
  return { status: 0, message: "Unknown error", details: err };
}

export default apiClient;
