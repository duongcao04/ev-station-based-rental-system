import * as yup from "yup";

export const registerDeviceSchema = yup.object({
	userId: yup.string().required("userId is required"),
	fcmToken: yup.string().required("fcmToken is required"),
	platform: yup
		.mixed<"ios" | "android" | "web">()
		.oneOf(["ios", "android", "web"], "Invalid platform")
		.required("platform is required"),
	deviceName: yup.string().optional(),
});

export type RegisterDeviceDto = yup.InferType<typeof registerDeviceSchema>;