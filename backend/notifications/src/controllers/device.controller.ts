import { NextFunction, Request, Response } from "express";
import { deviceService } from "../services/devices.service";

const registerDevice = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = (req as any).user.id; // however you get user id from auth
		const { fcmToken, platform, deviceName } = req.body;

		if (!fcmToken || !platform) {
			return res.status(400).json({ message: 'Missing fcmToken or platform' });
		}

		const device = await deviceService.registerDevice({ userId, fcmToken, platform, deviceName });
		res.json(device);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to register device' });
	}
}

const deviceController = { registerDevice }
export default deviceController;