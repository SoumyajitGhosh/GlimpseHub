import apiClient, { authHeader } from "./apiClient";

/**
 * Retrieves posts from user's feed
 * @function retrieveFeedPosts
 * @param {string} authToken A user's auth token
 * @param {number} offset The offset of posts to retrieve
 * @returns {array} Array of posts
 */
export const retrieveFeedPosts = async (authToken, offset = 0) => {
  const { data } = await apiClient.get(
    `/post/feed/${offset}`,
    authHeader(authToken)
  );
  return data;
};
