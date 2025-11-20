import { Router } from 'express';
import deviceController from '../controllers/device.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authMiddleware.authenticate, deviceController.registerDevice);

export default router;