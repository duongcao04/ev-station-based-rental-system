importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAqu7tmSBlvb2G88U2f9LhBkVFZZL0LSOQ",
  authDomain: "ev-rental-a17ae.firebaseapp.com",
  projectId: "ev-rental-a17ae",
  storageBucket: "ev-rental-a17ae.firebasestorage.app",
  messagingSenderId: "562689774640",
  appId: "1:562689774640:web:a6fbc7b11f9ab7950249f5",
  measurementId: "G-9MD7ZBWE15"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  
  // Lấy thông tin từ payload
  const notificationTitle = payload.notification?.title || payload.data?.title || "Thông báo mới";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
    // Các options bổ sung để notification hoạt động tốt hơn
    tag: payload.data?.tag || 'default-tag', // Tránh spam notification
    requireInteraction: false, // Auto đóng sau vài giây
    vibrate: [200, 100, 200], // Rung khi nhận notification (mobile)
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked", event);
  
  event.notification.close();

  // Mở URL nếu có trong data
  const urlToOpen = event.notification.data?.url || event.notification.data?.link || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUnattached: true }).then((windowClients) => {
      // Kiểm tra xem đã có tab nào mở app chưa
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Nếu chưa có, mở tab mới
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});