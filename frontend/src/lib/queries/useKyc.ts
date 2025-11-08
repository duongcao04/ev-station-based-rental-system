import { useMutation, useQuery } from "@tanstack/react-query"
import { kycApi } from "../api/kyc.api";

export const useKYCUpload = () => {
	return useMutation({
		mutationFn: ({ file, type }: { file: File; type: "front" | "back" | "face" }) => kycApi.uploadImage(file, type),
	})
}

export const useOCRProcess = () => {
	return useMutation({
		mutationFn: ({ file, type }: { file: File; type: "front" | "back" }) => kycApi.ocrProcess(file, type),
	})
}

export const useFaceVerification = () => {
	return useMutation({
		mutationFn: (file: File) => kycApi.faceVerification(file),
	})
}

export const useKYCSubmit = () => {
	return useMutation({
		mutationFn: (data) => kycApi.submitKYC(data),
	})
}

export const useKYCStatus = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["kycStatus"],
		queryFn: () => kycApi.getKYCStatus(),
	})
	return { data: data?.data, isLoading }
}
