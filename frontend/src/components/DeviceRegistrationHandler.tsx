import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { useProfile } from '@/lib/queries/useAuth';
import { registerDevice } from '@/lib/api/notification.api';
import { toast } from 'sonner';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export function DeviceRegistrationHandler() {
  const { data: user } = useProfile();

  useEffect(() => {
    console.log("Start register device")
    if (user && 'Notification' in window && Notification.permission === 'granted') {
      const register = async () => {
        try {
          const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
          if (fcmToken) {
            console.log('FCM Token:', fcmToken);
            // You can send this token to your server to subscribe to push notifications
            await registerDevice(fcmToken, 'web', 'WebApp');
            console.log('Device registered successfully');
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } catch (error) {
          console.error('An error occurred while retrieving token. ', error);
          toast.error('Could not register for notifications.');
        }
      };
      register();
    }
  }, [user]);

  return null; // This component does not render anything
}
