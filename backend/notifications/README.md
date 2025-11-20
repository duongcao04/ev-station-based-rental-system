# Notification Service (Node.js + TypeScript + PostgreSQL + FCM)

## Service provides APIs for:
- Registering user devices with FCM tokens
- Sending notifications to a user
- Storing notifications in PostgreSQL (via Prisma)
- Fetching notifications by user
- Marking notifications as read
- Sending push notifications through Firebase Cloud Messaging (FCM)

## Environment Variables
### .env file
```bash
PORT=
# URL for microservice database
# P/s: One microservice should have one database
DATABASE_URL=
# Client url for CORS origin 
CLIENT_URL=
```
### Provide Firebase Admin SDK Config
```bash 
/src/helpers/firebase/firebase-service-account.json
```

## High-Level Flow
1. Register Device
Client obtains FCM token (fcmToken).
Client calls POST /api/devices/register.
Backend validates request with Yup.
UserDevice is upserted in Postgres (create or update by fcmToken).

2. Send Notification
Server/Client calls POST /api/notifications/send with:
userId, message, optional title, url, type, data.

Backend:
Validates with Yup.
Creates a Notification row in DB.
Loads UserDevice tokens for that userId.
Sends push notification via FCM.
Cleans invalid FCM tokens from DB.

3. Get Notifications
Client calls GET /api/notifications/:userId.
Backend returns paginated notifications for that user.

4. Mark Notification as Read
Client calls PATCH /api/notifications/:notificationId/read.
Backend sets isRead = true on that notification.

## 📡 API Endpoints

### 1. Register Device
#### POST /api/devices/register

- Body
{
  "userId": "USER_ID_HERE",
  "fcmToken": "FCM_TOKEN_HERE",
  "platform": "android",
  "deviceName": "iPhone 15 Pro"
}

- Validation (Yup)
userId: required string
fcmToken: required string
platform: one of "ios" | "android" | "web"
deviceName: optional string

- Flow
Upsert UserDevice by fcmToken
Update userId, platform, deviceName, lastActiveAt

- Sample Response
{
  "id": "uuid",
  "userId": "USER_ID_HERE",
  "fcmToken": "FCM_TOKEN_HERE",
  "platform": "android",
  "deviceName": "iPhone 15 Pro",
  "createdAt": "2025-11-20T07:28:33.000Z",
  "updatedAt": "2025-11-20T07:28:33.000Z",
  "lastActiveAt": "2025-11-20T07:28:33.000Z"
}

### 2. Send Notification
#### POST /api/notifications/send

- Body
{
  "userId": "USER_ID_HERE",
  "title": "Booking confirmed",
  "message": "Your booking #123 has been confirmed.",
  "type": "BOOKING_CONFIRMED",
  "url": "/bookings/123",
  "data": {
    "bookingId": "123"
  }
}

- Validation (Yup)
userId: required
message: required
title: optional
type: optional, enum NotificationType
url: optional, URL
data: optional, object whose values must be strings (FCM data payload)

- Flow
Validate request with sendNotificationSchema.
Create Notification record in DB.
Get all UserDevice for userId.
Build FCM MulticastMessage with:
tokens: user devices’ fcmToken
notification.title / notification.body
data: extra payload (all string values)
Send via messaging.sendEachForMulticast().
Remove invalid tokens (invalid-registration-token, registration-token-not-registered).

- Sample Response
{
  "success": true,
  "notification": {
    "id": "NOTIF_ID",
    "userId": "USER_ID_HERE",
    "title": "Booking confirmed",
    "message": "Your booking #123 has been confirmed.",
    "type": "BOOKING_CONFIRMED",
    "url": "/bookings/123",
    "isRead": false,
    "createdAt": "2025-11-20T07:30:00.000Z",
    "updatedAt": "2025-11-20T07:30:00.000Z"
  },
  "fcm": {
    "successCount": 1,
    "failureCount": 0,
    "removedTokens": []
  }
}

### 3. Get Notifications by User
#### GET /api/notifications/:userId

- Query Params
limit (optional, default 20)
offset (optional, default 0)
onlyUnread (optional, "true" | "false", default false)

- Example
GET /api/notifications/USER_ID_HERE?limit=10&offset=0&onlyUnread=true

Sample Response
{
  "success": true,
  "items": [
    {
      "id": "NOTIF_ID",
      "userId": "USER_ID_HERE",
      "title": "Booking confirmed",
      "message": "Your booking #123 has been confirmed.",
      "type": "BOOKING_CONFIRMED",
      "url": "/bookings/123",
      "isRead": false,
      "createdAt": "2025-11-20T07:30:00.000Z",
      "updatedAt": "2025-11-20T07:30:00.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}

### 4. Mark Notification as Read
#### PATCH /api/notifications/:notificationId/read

- Example
PATCH /api/notifications/NOTIF_ID/read

- Sample Response
{
  "success": true,
  "notification": {
    "id": "NOTIF_ID",
    "userId": "USER_ID_HERE",
    "title": "Booking confirmed",
    "message": "Your booking #123 has been confirmed.",
    "type": "BOOKING_CONFIRMED",
    "url": "/bookings/123",
    "isRead": true,
    "createdAt": "2025-11-20T07:30:00.000Z",
    "updatedAt": "2025-11-20T07:35:12.000Z"
  }
}

## Running the Service
#### Install dependencies
bun install    # or npm install / pnpm install / yarn

#### Run Prisma migrations
npx prisma migrate dev

#### Start dev server
```bash 
bun run src/index.ts
```
or: 
```bash
npm run dev / pnpm dev, depending on your setup
```