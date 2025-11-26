import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const requestNotificationPermission = async () => {
  console.log("Requesting notification permission...");
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
    return getFCMToken();
  } else {
    console.log("Unable to get permission to notify.");
    return null;
  }
};

export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // Here you would typically send this token to your backend server
      // e.g., sendTokenToServer(currentToken);
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};
