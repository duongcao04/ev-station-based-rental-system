# Changelog - Feature: Cron Notification Settings (Backend)

**Date: November 26, 2025**

## Overview

This changelog summarizes the backend changes implemented in the Notification Service to introduce a configurable cron job for promotional push notifications. This allows administrators to set the schedule and enable/disable the job dynamically through an API.

## Key Changes

### 1. Database Schema Update

*   **File:** `backend/notifications/prisma/schema.prisma`
*   **Description:**
    *   Added a new `CronJobSetting` model to store cron job configurations. This model includes fields such as `jobName` (unique identifier for the cron job, e.g., "PROMOTIONAL_NOTIFICATION"), `cronTime` (the cron expression), `isEnabled` (boolean to enable/disable the job), and timestamps.
    *   Added the `PROMOTION` type to the `NotificationType` enum to categorize promotional notifications.
*   **Migration:** A new Prisma migration (`add_cron_job_setting`) was created and applied to update the database schema.

### 2. New API for Cron Job Settings Management

*   **Endpoint:** `/api/v1/cron/settings` (GET, PUT)
*   **Description:** Implemented a new set of API endpoints to allow fetching and updating the cron job settings.
    *   **`cron.service.ts`:** Contains business logic for interacting with the `CronJobSetting` model in the database, including `getCronJobSettingService` (to retrieve settings, with a default creation if none exist) and `updateCronJobSettingService` (to update existing settings).
    *   **`cron.controller.ts`:** Handles incoming HTTP requests for cron settings, validates input using `cron.schema.ts`, and calls the appropriate service functions.
    *   **`cron.routes.ts`:** Defines the API routes (`GET /settings`, `PUT /settings`) and applies `authMiddleware` for protection.
    *   **`cron.schema.ts`:** Provides Joi-based validation for incoming cron job setting payloads, including a regex check for cron expressions.
    *   **`cron.types.ts`:** Defines the TypeScript interface `ICronJobSetting` for type consistency.
*   **Route Integration:** The new cron routes were integrated into the main `rootRouter` in `backend/notifications/src/routes/index.ts`.

### 3. Dynamic Cron Job Scheduling

*   **File:** `backend/notifications/src/cron/jobs.ts`
*   **Description:** The hardcoded cron schedule for promotional notifications was replaced with a dynamic mechanism.
    *   On service startup, the job now fetches the `cronTime` and `isEnabled` status from the `CronJobSetting` table using `getCronJobSettingService`.
    *   The promotional notification job is only scheduled if `isEnabled` is `true` and the `cronTime` expression is valid.
    *   The service must be restarted for any changes to the cron schedule (made via the API) to take effect.

### 4. Notification Service Refinement

*   **File:** `backend/notifications/src/services/notification.service.ts`
*   **Description:** The `sendNotificationToAllUsers` function was updated to correctly accept an optional `type` parameter (defaulting to `PROMOTION`), which is then passed down to `sendNotificationService`. This ensures that promotional notifications are correctly categorized in the database.

## Impact

*   **Administrators:** Gained the ability to configure the schedule and activation status of promotional notifications without code deployment.
*   **Flexibility:** The Notification Service is now more adaptable to changing marketing and communication strategies.
*   **Maintainability:** Centralized cron settings in the database simplify management and reduce the risk of errors associated with hardcoded schedules.
