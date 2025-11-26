import { axiosClient } from "../axios";
import { type ICronJobSetting } from "@/types/cron.types";

const CRON_API_URL = "/v1/cron";

export type UpdateCronPayload = {
  cronTime: string;
  isEnabled: boolean;
};

/**
 * Fetches the current cron job settings.
 * @returns {Promise<ICronJobSetting>} The current cron settings.
 */
export const getCronSettings = async (): Promise<ICronJobSetting> => {
  const response = await axiosClient.get(`${CRON_API_URL}/settings`);
  return response.data;
};

/**
 * Updates the cron job settings.
 * @param {UpdateCronPayload} payload - The new settings to apply.
 * @returns {Promise<any>} The response from the server.
 */
export const updateCronSettings = async (payload: UpdateCronPayload): Promise<any> => {
  const response = await axiosClient.put(`${CRON_API_URL}/settings`, payload);
  return response.data;
};
