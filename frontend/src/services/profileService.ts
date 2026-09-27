import apiClient, { authHeader } from "./apiClient";
import type { FollowListResponse, FollowResponse, ProfileResponse } from "../types";

/**
 * Fetches the profile information of a specific user.
 */
export const getUserProfile = async (
  username: string,
  authToken?: string | null
): Promise<ProfileResponse> => {
  const { data } = await apiClient.get<ProfileResponse>(
    `/user/${username}`,
    authToken ? authHeader(authToken) : undefined
  );
  return data;
};

/**
 * Follows or unfollows a user depending on whether they are already followed.
 */
export const followUser = async (
  userId: string,
  authToken: string
): Promise<FollowResponse> => {
  const { data } = await apiClient.post<FollowResponse>(
    `/user/${userId}/follow`,
    null,
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves who the user is following.
 */
export const retrieveUserFollowing = async (
  userId: string,
  offset: number,
  authToken: string
): Promise<FollowListResponse> => {
  const { data } = await apiClient.get<FollowListResponse>(
    `/user/${userId}/${offset}/following`,
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves who is following the user.
 */
export const retrieveUserFollowers = async (
  userId: string,
  offset: number,
  authToken: string
): Promise<FollowListResponse> => {
  const { data } = await apiClient.get<FollowListResponse>(
    `/user/${userId}/${offset}/followers`,
    authHeader(authToken)
  );
  return data;
};
