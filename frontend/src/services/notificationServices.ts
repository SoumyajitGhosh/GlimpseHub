import apiClient, { authHeader } from "./apiClient";
import type { NotificationsResponse } from "../types";

/**
 * Retrieves a user's notifications.
 */
export const retrieveNotifications = async (
  authToken: string
): Promise<NotificationsResponse> => {
  const { data } = await apiClient.get<NotificationsResponse>(
    "/notification",
    authHeader(authToken)
  );
  return data;
};

/**
 * Marks all of the user's notifications read.
 */
export const readNotifications = async (authToken: string): Promise<void> => {
  await apiClient.put("/notification", null, authHeader(authToken));
};
