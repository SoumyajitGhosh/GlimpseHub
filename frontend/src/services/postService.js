import apiClient, { authHeader } from "./apiClient";

/**
 * Fetches a complete post with comments and the fully
 * sized image instead of a thumbnail image
 * @function getPost
 * @param {string} postId Id of the post to fetch
 * @returns {object} The post requested
 */
export const getPost = async (postId) => {
  const { data } = await apiClient.get(`/post/${postId}`);
  return data;
};

/**
 * Retrieves a page of a user's posts
 * @param {string} username A users username
 * @param {number} offset The amount of posts to skip
 * @returns {array} Array of posts
 */
export const getPosts = async (username, offset = 0) => {
  const { data } = await apiClient.get(`/user/${username}/posts/${offset}`);
  return data;
};

/**
 * Either likes or dislikes a post
 * @function votePost
 * @param {string} postId The id of the post to be voted on
 * @param {string} authToken The user's auth token
 */
export const votePost = async (postId, authToken) => {
  await apiClient.post(`/post/${postId}/vote`, null, authHeader(authToken));
};

/**
 * Sends an image and a caption as multipart/form-data and creates a post
 * @function createPost
 * @param {object} formData Multipart form data about the image being uploaded
 * @param {string} authToken The user's auth token
 * @returns {object} The created post
 */
export const createPost = async (formData, authToken) => {
  const { data } = await apiClient.post("/post", formData, {
    headers: {
      authorization: authToken,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/**
 * Deletes a post
 * @function deletePost
 * @param {string} postId The id of the post to delete
 * @param {string} authToken A user's auth token
 */
export const deletePost = async (postId, authToken) => {
  await apiClient.delete(`/post/${postId}`, authHeader(authToken));
};

/**
 * Toggles bookmarking a post
 * @param {string} postId The id of the post to bookmark
 * @param {string} authToken A user's auth token
 * @return {object}
 */
export const bookmarkPost = async (postId, authToken) => {
  const { data } = await apiClient.post(
    `/user/${postId}/bookmark`,
    null,
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves all filters
 * @function getPostFilters
 * @returns {array} Array of filters
 */
export const getPostFilters = async () => {
  const { data } = await apiClient.get("/post/filters");
  return data;
};

/**
 * Gets suggested posts
 * @function getSuggestedPosts
 * @param {string} authToken A user's auth token
 * @param {number} offset The amounts of posts to skip
 * @returns {array} Array of posts
 */
export const getSuggestedPosts = async (authToken, offset = 0) => {
  const { data } = await apiClient.get(
    `/post/suggested/${offset}`,
    authHeader(authToken)
  );
  return data;
};

/**
 * Gets posts associated with a specific hashtag
 * @function getHashtagPosts
 * @param {string} authToken A user's auth token
 * @param {string} hashtag The hashtag to find posts by
 * @param {number} offset The amount of posts to skip
 * @returns {array} Array of posts
 */
export const getHashtagPosts = async (authToken, hashtag, offset = 0) => {
  const { data } = await apiClient.get(
    `/post/hashtag/${hashtag}/${offset}`,
    authHeader(authToken)
  );
  return data;
};
