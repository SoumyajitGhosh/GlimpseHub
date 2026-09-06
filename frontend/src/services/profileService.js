import apiClient, { authHeader } from "./apiClient";

/**
 * Fetches the profile information of a specific user
 * @function getUserProfile
 * @param {string} username Username of profile to fetch
 * @param {string} [authToken] A user's auth token (optional — enables follow state)
 */
export const getUserProfile = async (username, authToken) => {
  const { data } = await apiClient.get(
    `/user/${username}`,
    authToken ? authHeader(authToken) : undefined
  );
  return data;
};

/**
 * Follows or unfollows a user with a given id depending on
 * whether they are already followed
 * @function followUser
 * @param {string} userId The id of the user to follow/unfollow
 * @param {string} authToken A user's auth token
 */
export const followUser = async (userId, authToken) => {
  const { data } = await apiClient.post(
    `/user/${userId}/follow`,
    null,
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves who the user is following
 * @function retrieveUserFollowing
 * @param {string} userId The id of the user to retrieve following users from
 * @param {number} offset The offset of how many users to skip for the next fetch
 * @param {string} authToken A user's auth token
 */
export const retrieveUserFollowing = async (userId, offset, authToken) => {
  const { data } = await apiClient.get(
    `/user/${userId}/${offset}/following`,
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves who is following the user
 * @function retrieveUserFollowers
 * @param {string} userId The id of the user to retrieve followers from
 * @param {number} offset The offset of how many users to skip for the next fetch
 * @param {string} authToken A user's auth token
 */
export const retrieveUserFollowers = async (userId, offset, authToken) => {
  const { data } = await apiClient.get(
    `/user/${userId}/${offset}/followers`,
    authHeader(authToken)
  );
  return data;
};
