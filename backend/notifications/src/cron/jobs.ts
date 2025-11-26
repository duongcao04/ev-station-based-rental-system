import cron from 'node-cron';
import { sendNotificationToAllUsers } from '../services/notification.service';

// Cron job to send promotional notifications every day at 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Running a job at 08:00 at America/Los_Angeles timezone');
    try {
        // In a real-world scenario, you would fetch promotions from the vehicle service
        // For now, we'll use a placeholder
        const promotions = {
            title: '🎉 Ưu đãi đặc biệt!',
            body: 'Giảm giá 20% cho tất cả các dòng xe Vinfast. Khám phá ngay!',
            url: '/thue-xe-tu-lai?filter=promotion'
        };

        await sendNotificationToAllUsers(promotions.title, promotions.body, promotions.url);
        console.log('Promotional notifications sent successfully.');
    } catch (error) {
        console.error('Error sending promotional notifications:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});
