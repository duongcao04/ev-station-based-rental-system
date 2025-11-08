import { axiosClient } from "../axios"

interface OCRResult {
	idNumber?: string
	fullName?: string
	birthDate?: string
	permanentAddress?: string
	districtCode?: string
	wardCode?: string
	provinceCode?: string
	expiryDate?: string
}

interface BackOCRResult {
	issuedBy?: string
	issueDate?: string
	ethnicity?: string
	religion?: string
}

interface FaceVerificationResult {
	status: "pending" | "verified" | "failed"
	confidence?: number
}

interface KYCSubmission {
	frontImage?: File
	backImage?: File
	faceImage?: File
	frontOCR?: OCRResult
	backOCR?: BackOCRResult
	faceVerification?: FaceVerificationResult
}

export const kycApi = {
	uploadImage: async (file: File, type: "front" | "back" | "face") => {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("type", type)
		return axiosClient.post("/kyc/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
	},

	ocrProcess: async (file: File, type: "front" | "back") => {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("type", type)
		return axiosClient.post("/kyc/ocr", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
	},

	faceVerification: async (file: File) => {
		const formData = new FormData()
		formData.append("file", file)
		return axiosClient.post("/kyc/face-verification", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
	},

	submitKYC: async (data: KYCSubmission) => {
		return axiosClient.post("/kyc/submit", data)
	},

	getKYCStatus: async () => {
		return axiosClient.get("/kyc/status")
	},
}
