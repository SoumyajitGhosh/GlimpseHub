import type { AxiosRequestConfig } from "axios";

import apiClient, { authHeader } from "./apiClient";
import type {
  AvatarResponse,
  CurrentUser,
  ProfileUpdates,
  SuggestedUser,
  User,
} from "../types";

/**
 * Searches for a username similar to the one supplied.
 * Swallows non-abort errors (returns []) so the type-ahead never throws into
 * the debounced search hook; aborted requests are re-thrown so the caller can
 * ignore them.
 */
export const searchUsers = async (
  username: string,
  offset = 0,
  config: AxiosRequestConfig = {}
): Promise<User[]> => {
  try {
    const { data } = await apiClient.get<User[]>(
      `/user/${username}/${offset}/search`,
      config
    );
    return data;
  } catch (err) {
    if ((err as { code?: string })?.code === "ERR_CANCELED") throw err;
    console.warn(err);
    return [];
  }
};

/**
 * Verifies a user's email.
 */
export const confirmUser = async (
  authToken: string,
  confirmationToken: string
): Promise<void> => {
  await apiClient.put(
    "/user/confirm",
    { token: confirmationToken },
    authHeader(authToken)
  );
};

/**
 * Uploads and changes a user's avatar.
 */
export const changeAvatar = async (
  image: Blob,
  authToken: string
): Promise<AvatarResponse> => {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await apiClient.put<AvatarResponse>("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: authToken,
    },
  });
  return data;
};

/**
 * Removes a user's current avatar.
 */
export const removeAvatar = async (authToken: string): Promise<void> => {
  await apiClient.delete("/user/avatar", authHeader(authToken));
};

/**
 * Updates the specified fields on the user.
 */
export const updateProfile = async (
  authToken: string,
  updates: ProfileUpdates
): Promise<Partial<CurrentUser>> => {
  const { data } = await apiClient.put<Partial<CurrentUser>>(
    "/user",
    { ...updates },
    authHeader(authToken)
  );
  return data;
};

/**
 * Gets random suggested users for the user to follow.
 */
export const getSuggestedUsers = async (
  authToken: string,
  max?: number
): Promise<SuggestedUser[]> => {
  const { data } = await apiClient.get<SuggestedUser[]>(
    `/user/suggested/${max || ""}`,
    authHeader(authToken)
  );
  return data;
};
