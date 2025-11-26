# Changelog - Feature: Cron Notification Settings (Frontend)

**Date: November 26, 2025**

## Overview

This changelog summarizes the frontend changes made to introduce a new feature allowing administrators to view and modify the schedule for promotional push notifications. This feature integrates with the previously updated backend Notification Service.

## Key Changes

### 1. New API Service for Cron Settings

*   **File:** `frontend/src/lib/api/cron.api.ts`
*   **Description:** Created a dedicated API service to interact with the Notification Service's new cron endpoints. It includes functions to:
    *   `getCronSettings`: Fetch the current cron job configuration.
    *   `updateCronSettings`: Send updated cron job configuration to the backend.

### 2. New Type Definitions

*   **File:** `frontend/src/types/cron.types.ts`
*   **Description:** Defined the `ICronJobSetting` interface to ensure type safety and consistency with the backend's `CronJobSetting` model.

### 3. Cron Settings Manager Component

*   **File:** `frontend/src/pages/dashboard/components/CronSettingsManager.tsx`
*   **Description:** Developed a new React component to provide a user interface for managing the cron settings.
    *   **Data Fetching:** Utilizes `@tanstack/react-query` (`useQuery`) to fetch the initial cron settings.
    *   **Form Management:** Uses `react-hook-form` and `zod` for form validation and state management, ensuring valid cron expressions and boolean states.
    *   **UI Elements:** Employs Radix-UI based components (Card, Input, Switch, Button) for a consistent look and feel.
    *   **Data Mutation:** Uses `@tanstack/react-query` (`useMutation`) to send updates to the backend and provides user feedback via `sonner` toasts.

### 4. Integration into Dashboard Settings

*   **File:** `frontend/src/pages/dashboard/components/Setting.tsx`
*   **Description:** The `CronSettingsManager` component was integrated into the main `Settings` page of the admin dashboard. It is displayed as a dedicated card, allowing administrators easy access to configure the promotional notification schedule.

## Impact

*   **Administrators:** Can now directly control the timing and activation status of promotional push notifications through a user-friendly interface in the dashboard.
*   **System Flexibility:** Provides greater control over scheduled tasks without requiring direct database or code modifications.
*   **User Experience:** Ensures that promotional notifications can be scheduled strategically to maximize engagement.
