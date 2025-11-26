import { Request, Response } from 'express';
import {
    getCronJobSettingService,
    updateCronJobSettingService,
} from '../services/cron.service';
import { cronJobValidationSchema } from '../validationSchemas/cron.schema';

/**
 * Gets the current cron job settings.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const getCronJobSetting = async (req: Request, res: Response) => {
    try {
        const setting = await getCronJobSettingService();
        res.status(200).json(setting);
    } catch (error) {
        console.error('Error getting cron job setting:', error);
        res.status(500).json({ message: 'Failed to get cron job settings' });
    }
};

/**
 * Updates the cron job settings.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const updateCronJobSetting = async (req: Request, res: Response) => {
    try {
        const { error, value } = cronJobValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { cronTime, isEnabled } = value;
        const updatedSetting = await updateCronJobSettingService(cronTime, isEnabled);

        res.status(200).json({
            message: 'Cron job setting updated successfully. Restart the service for changes to take effect.',
            setting: updatedSetting,
        });
    } catch (error) {
        console.error('Error updating cron job setting:', error);
        res.status(500).json({ message: 'Failed to update cron job settings' });
    }
};
