import * as Yup from 'yup';
import { NotificationType } from '@prisma/client';

export const createNotificationSchema = Yup.object().shape({
	userId: Yup.string().required(),
	message: Yup.string().required(),
	title: Yup.string().optional(),
	isRead: Yup.boolean().default(false).optional(),
	type: Yup.string()
		.oneOf(Object.values(NotificationType))
		.required(),
	url: Yup.string()
		.optional(),
});

export type CreateNotificationDto = Yup.InferType<typeof createNotificationSchema>;