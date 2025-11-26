import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './AppRouter'
import './index.css'
import { setQueryClient } from './stores/useAuthStore'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from './lib/firebase'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Register service worker and get FCM token
async function registerServiceWorkerAndGetToken() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      console.log('VAPID KEY:', import.meta.env.VITE_FIREBASE_VAPID_KEY);
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('✅ Service Worker registered:', registration.scope);

      // Wait for SW to be ready
      await navigator.serviceWorker.ready;
      console.log('✅ Service Worker ready');

      // Request permission
      const permission = await Notification.requestPermission();
      console.log('📢 Notification permission:', permission);

      if (permission !== 'granted') {
        console.log('❌ Notification permission not granted');
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('🔑 FCM Token:', token);

        // TODO: Gửi token lên server
        // await fetch('/api/save-token', { 
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ token }) 
        // });

        return token;
      } else {
        console.log('❌ Failed to get FCM token');
        return null;
      }
    } catch (err) {
      console.error('❌ SW registration or getToken failed:', err);
      return null;
    }
  } else {
    console.warn('⚠️ Service workers or Push messaging not supported');
    return null;
  }
}

// Component wrapper để handle foreground messages
function AppWithNotifications() {
  useEffect(() => {
    // Setup foreground message listener
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📨 Message received in foreground:', payload);

      // Hiển thị notification khi app đang mở
      const notificationTitle = payload.notification?.title || payload.data?.title || 'Thông báo mới';
      const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || '',
        icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.tag || Date.now().toString(),
        data: payload.data || {}
      };

      // Hiển thị notification (cần permission)
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions);
      }

      // Hoặc hiển thị toast/snackbar trong app
      // toast.success(notificationTitle, { description: notificationOptions.body });
    });

    // Cleanup listener khi unmount
    return () => unsubscribe();
  }, []);

  return <AppRouter />;
}

// Initialize
const queryClient = new QueryClient();
setQueryClient(queryClient);

// Register SW và get token trước khi render app
registerServiceWorkerAndGetToken().then((token) => {
  if (token) {
    console.log('✅ Token ready to use');
    // Có thể lưu token vào localStorage hoặc state management
    localStorage.setItem('fcm_token', token);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithNotifications />
    </QueryClientProvider>
  </StrictMode>,
)