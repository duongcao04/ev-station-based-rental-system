import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '@/lib/queries/useAuth';

export function RealtimeNotificationHandler() {
  const queryClient = useQueryClient();
  const { data: user } = useProfile();

  useEffect(() => {
    if ('serviceWorker' in navigator && user) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        toast.info(payload.notification?.title || 'New Notification', {
          description: payload.notification?.body,
        });
        queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [queryClient, user]);

  return null; // This component does not render anything
}
