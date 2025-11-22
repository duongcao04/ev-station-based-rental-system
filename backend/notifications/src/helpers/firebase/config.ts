import admin from 'firebase-admin';
import fs from 'fs';

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
const json = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(json),
	});
}

export const messaging = admin.messaging();
