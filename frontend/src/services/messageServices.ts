import apiClient, { authHeader } from "./apiClient";
import type { Message } from "../types";

/**
 * Sends a message to another user.
 */
export const sendMessage = async (
  id: string,
  authToken: string,
  message: string
): Promise<Message> => {
  const { data } = await apiClient.post<Message>(
    `/message/send/${id}`,
    { message },
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves the 1:1 message history with another user.
 */
export const getMessages = async (
  id: string,
  authToken: string
): Promise<Message[]> => {
  const { data } = await apiClient.get<Message[]>(`/message/${id}`, authHeader(authToken));
  return data;
};
