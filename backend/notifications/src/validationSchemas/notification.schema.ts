import * as yup from "yup";

export const sendNotificationSchema = yup.object({
	userId: yup.string().required("userId is required"),
	title: yup.string().nullable(),
	message: yup.string().required("message is required"),
	type: yup
		.mixed<"NEW_MESSAGE" | "NEW_FOLLOWER" | "SYSTEM_ALERT" | "BOOKING_CONFIRMED" | "BOOKING_REMINDER" | "INFO">()
		.oneOf(
			[
				"NEW_MESSAGE",
				"NEW_FOLLOWER",
				"SYSTEM_ALERT",
				"BOOKING_CONFIRMED",
				"BOOKING_REMINDER",
				"INFO",
			],
			"Invalid notification type",
		)
		.default("INFO"),
	url: yup.string().url("url must be a valid URL").optional().nullable(),
	// Optional extra payload for FCM (e.g., { bookingId: "123" })
	data: yup
		.object()
		.optional()
		.default({})
		.test(
			"string-values-only",
			"data values must be strings",
			(value) => {
				if (!value) return true;
				return Object.values(value).every((v) => typeof v === "string");
			},
		),
});

export type SendNotificationDto = yup.InferType<typeof sendNotificationSchema>;
