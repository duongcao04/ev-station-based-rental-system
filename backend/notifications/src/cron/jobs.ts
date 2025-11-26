import cron from 'node-cron';
import { sendNotificationToAllUsers } from '../services/notification.service';
import { getCronJobSettingService } from '../services/cron.service';

const schedulePromotionalNotifications = async () => {
    try {
        console.log('Initializing cron jobs...');
        const { cronTime, isEnabled } = await getCronJobSettingService();

        if (!isEnabled) {
            console.log('Promotional notification job is disabled. Skipping schedule.');
            return;
        }

        if (cron.validate(cronTime)) {
            cron.schedule(cronTime, async () => {
                console.log(`Running promotional notification job with schedule: ${cronTime}`);
                try {
                    const promotions = {
                        title: '🎉 Ưu đãi đặc biệt!',
                        body: 'Giảm giá 20% cho tất cả các dòng xe Vinfast. Khám phá ngay!',
                        url: '/thue-xe-tu-lai?filter=promotion'
                    };

                    await sendNotificationToAllUsers(promotions.title, promotions.body, 'PROMOTION', promotions.url);
                    console.log('Promotional notifications sent successfully.');
                } catch (error) {
                    console.error('Error sending promotional notifications:', error);
                }
            }, {
                scheduled: true,
                timezone: "Asia/Ho_Chi_Minh"
            });

            console.log(`Successfully scheduled promotional notification job with schedule: ${cronTime}`);
        } else {
            console.error(`Invalid cron expression "${cronTime}" from database. Job not scheduled.`);
        }
    } catch (error) {
        console.error('Failed to initialize cron jobs:', error);
    }
};

// Immediately invoke the scheduling function when the service starts.
schedulePromotionalNotifications();
