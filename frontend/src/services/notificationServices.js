import apiClient, { authHeader } from "./apiClient";

/**
 * Retrieves a users notifications
 * @function retrieveNotifications
 * @param {string} authToken A user's auth token
 * @returns {array} Array of notifications
 */
export const retrieveNotifications = async (authToken) => {
  const { data } = await apiClient.get("/notification", authHeader(authToken));
  return data;
};

/**
 * Reads all the user's notifications
 * @function readNotifications
 * @param {string} authToken A user's auth token
 */
export const readNotifications = async (authToken) => {
  await apiClient.put("/notification", null, authHeader(authToken));
};
