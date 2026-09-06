import apiClient, { authHeader } from "./apiClient";

/**
 * Sends a message to another user
 * @function sendMessage
 * @param {string} id Receiver's ID
 * @param {string} authToken A user's auth token
 * @param {string} message The message body
 * @returns {object} Object containing message and message details
 */
export const sendMessage = async (id, authToken, message) => {
  const { data } = await apiClient.post(
    `/message/send/${id}`,
    { message },
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves the 1:1 message history with another user
 * @param {string} id ID of the user with whom the chat we need to fetch
 * @param {string} authToken A user's auth token
 * @returns {array} Array of objects(each object is a message)
 */
export const getMessages = async (id, authToken) => {
  const { data } = await apiClient.get(`/message/${id}`, authHeader(authToken));
  return data;
};
