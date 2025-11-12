import axios from 'axios'
import { envConfig } from './config/envConfig'

export const BASE_URL = String(envConfig.VITE_API_ENDPOINT)

export type ApiResponse<T = unknown, D = Record<string, unknown>> = {
  success: boolean
  message: string
  error?: string
  result?: T
  meta?: D
  timestamp?: string
}

export type ApiError = {
  success: boolean
  message: string
  error?: string
  timestamp?: string
}

// Shared request interceptor
// Note: Token được lưu trong HTTP-only cookie bởi backend
// Browser tự động gửi cookie trong mọi request (với withCredentials: true)
// Không cần thêm Authorization header thủ công
const requestInterceptor = (config: any) => {
  console.log('🔍 Request URL:', config.baseURL + config.url);

  // Set Content-Type (will be overridden for FormData requests)
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
}

const requestErrorInterceptor = (error: any) => {
  if (error?.response) return Promise.reject(error.response)
  return Promise.reject(error)
}

// Single axios client for API Gateway
// All requests will go through API Gateway (http://localhost:8000/api)
export const axiosClient = axios.create({
  baseURL: BASE_URL, // API Gateway endpoint (http://localhost:8000/api)
  timeout: 30000, // Increased timeout for API Gateway
  withCredentials: true, // Allow sending cookies
})

// Apply interceptors
axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)


// Shared response interceptor
const responseInterceptor = (response: any) => {
  return response
}

const responseErrorInterceptor = (error: any) => {
  // Any status code outside 2xx triggers this
  if (error.response) {
    // Server responded with a status code outside 2xx
    console.error('Response error:', error.response.status, error.response.data)
    return Promise.reject(error.response.data) // or full error.response
  } else if (error.request) {
    // Request was made but no response received
    console.error('No response received:', error.request)
    return Promise.reject({ message: 'No response from server' })
  } else {
    // Something else happened while setting up the request
    console.error('Axios error:', error.message)
    return Promise.reject({ message: error.message })
  }
}

axiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
