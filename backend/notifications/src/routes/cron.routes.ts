import { Router } from 'express';
import {
  getCronJobSetting,
  updateCronJobSetting,
  triggerPromotionalJob,
} from '../controllers/cron.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes in this file are protected and require authentication
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/v1/cron/settings:
 *   get:
 *     summary: Get the current cron job settings for promotional notifications
 *     tags: [CronSettings]
 *     responses:
 *       200:
 *         description: Successfully retrieved the settings.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CronJobSetting'
 *       500:
 *         description: Server error
 */
router.get('/settings', getCronJobSetting);

/**
 * @swagger
 * /api/v1/cron/settings:
 *   put:
 *     summary: Update the cron job settings for promotional notifications
 *     tags: [CronSettings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cronTime:
 *                 type: string
 *                 example: "0 10 * * *"
 *                 description: "The cron expression (e.g., '0 10 * * *' for 10:00 AM daily)."
 *               isEnabled:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Settings updated successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error
 */
router.put('/settings', updateCronJobSetting);

/**
 * @swagger
 * /api/v1/cron/trigger:
 *   post:
 *     summary: Manually trigger the promotional notification job now
 *     tags: [CronSettings]
 *     responses:
 *       200:
 *         description: Successfully triggered the job.
 *       500:
 *         description: Server error
 */
router.post('/trigger', triggerPromotionalJob);

export default router;
