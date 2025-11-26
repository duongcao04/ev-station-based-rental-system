import { PrismaClient } from '@prisma/client';
import { ICronJobSetting } from '../types/cron.types';
import { runPromotionalJob } from '../cron/jobs';

const prisma = new PrismaClient();

const PROMOTIONAL_JOB_NAME = 'PROMOTIONAL_NOTIFICATION';

/**
 * Retrieves the cron job setting for promotional notifications.
 * If it doesn't exist, it creates a default setting (8:00 AM daily).
 * @returns {Promise<ICronJobSetting>} The cron job setting.
 */
export const getCronJobSettingService = async (): Promise<ICronJobSetting> => {
  let cronSetting = await prisma.cronJobSetting.findUnique({
    where: { jobName: PROMOTIONAL_JOB_NAME },
  });

  if (!cronSetting) {
    cronSetting = await prisma.cronJobSetting.create({
      data: {
        jobName: PROMOTIONAL_JOB_NAME,
        cronTime: '0 8 * * *', // Default: 8:00 AM every day
        isEnabled: true,
      },
    });
  }

  return cronSetting;
};

/**
 * Updates the cron job setting for promotional notifications.
 * @param {string} cronTime - The new cron expression.
 * @param {boolean} isEnabled - Whether the job is enabled.
 * @returns {Promise<ICronJobSetting>} The updated cron job setting.
 */
export const updateCronJobSettingService = async (
  cronTime: string,
  isEnabled: boolean,
): Promise<ICronJobSetting> => {
  const updatedSetting = await prisma.cronJobSetting.upsert({
    where: { jobName: PROMOTIONAL_JOB_NAME },
    update: { cronTime, isEnabled },
    create: {
      jobName: PROMOTIONAL_JOB_NAME,
      cronTime,
      isEnabled,
    },
  });

  return updatedSetting;
};

/**
 * Manually triggers the promotional notification job.
 */
export const triggerPromotionalJobService = async (): Promise<void> => {
  await runPromotionalJob();
};
