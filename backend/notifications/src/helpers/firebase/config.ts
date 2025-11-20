import admin from 'firebase-admin';
import path from 'path';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(
			// Option 1: load from local file (dev only)
			require(path.join(__dirname, './firebase-service-account.json'))
			// Option 2: parse JSON from env:
			// JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string)
		),
	});
}

export const messaging = admin.messaging();
