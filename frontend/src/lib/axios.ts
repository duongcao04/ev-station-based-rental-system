import { cookie } from '@/lib/cookie'
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
const requestInterceptor = (config: any) => {
	// Debug: Log full URL
	console.log('🔍 Request URL:', config.baseURL + config.url);

	// 1. Get token from cookie
	const token = cookie.get('authentication')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	config.headers['Content-Type'] = 'application/json'
	config.headers['Access-Control-Allow-Origin'] = String(envConfig.VITE_URL)
	config.headers['Access-Control-Allow-Credentials'] = 'true'
	// 2. Add mock user-id header for booking/payment services
	config.headers['x-user-id'] = 1001 // Mock renter user
	// 3. If token -> put token into header for Authentication
	return config
}

const requestErrorInterceptor = (error: any) => {
	if (error?.response) return Promise.reject(error.response)
	return Promise.reject(error)
}

export const axiosClient = axios.create({
	baseURL: BASE_URL, // API endpoint url (for Vehicles on 8099)
	timeout: 5000, // Request timeout
	// withCredentials: true, // Allow sending cookies
})

// Booking Service client (port 4000)
export const bookingAxiosClient = axios.create({
	baseURL: 'http://localhost:4000/api', // Booking Service
	timeout: 5000,
})

// Payment Service client (port 5000)
export const paymentAxiosClient = axios.create({
	baseURL: 'http://localhost:5000/api', // Payment Service
	timeout: 5000,
})

axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
bookingAxiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
paymentAxiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)


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
bookingAxiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
paymentAxiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor)