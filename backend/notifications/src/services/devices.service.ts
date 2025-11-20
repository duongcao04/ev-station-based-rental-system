import { prisma } from "../helpers/prisma";
import { RegisterDeviceDto } from "../validationSchemas/register-device.schema";

async function registerDevice(dto: RegisterDeviceDto) {
	const { userId, fcmToken, platform, deviceName } = dto;

	return prisma.userDevice.upsert({
		where: { fcmToken },
		update: {
			userId,
			platform,
			deviceName,
			lastActiveAt: new Date(),
		},
		create: {
			userId,
			fcmToken,
			platform,
			deviceName,
		},
	});
}

export const deviceService = { registerDevice }

