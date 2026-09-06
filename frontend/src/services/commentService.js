import apiClient, { authHeader } from "./apiClient";

/**
 * Creates a comment on a specific post
 * @function createComment
 * @param {string} message The message to be posted as a comment
 * @param {string} postId The id of the post to comment on
 * @param {string} authToken A user's auth token
 * @returns {object} The created comment
 */
export const createComment = async (message, postId, authToken) => {
  const { data } = await apiClient.post(
    `/comment/${postId}`,
    { message },
    authHeader(authToken)
  );
  return data;
};

/**
 * Deletes a comment with a specified comment id provided it was created by the user
 * @function deleteComment
 * @param {string} commentId Id of the comment to delete
 * @param {string} authToken A user's auth token
 */
export const deleteComment = async (commentId, authToken) => {
  await apiClient.delete(`/comment/${commentId}`, authHeader(authToken));
};

/**
 * Votes on a comment
 * @function voteComment
 * @param {string} commentId Id of the comment to vote on
 * @param {string} authToken A user's auth token
 */
export const voteComment = async (commentId, authToken) => {
  await apiClient.post(
    `/comment/${commentId}/vote`,
    null,
    authHeader(authToken)
  );
};

/**
 * Creates a reply to a specific comment
 * @function createCommentReply
 * @param {string} message The message to be replied with to a comment
 * @param {string} parentCommentId The id of the comment to be replied to
 * @param {string} authToken A user's auth token
 * @returns {object} The created comment reply
 */
export const createCommentReply = async (
  message,
  parentCommentId,
  authToken
) => {
  const { data } = await apiClient.post(
    `/comment/${parentCommentId}/reply`,
    { message },
    authHeader(authToken)
  );
  return data;
};

/**
 * Deletes a comment reply with a specified comment reply id provided it was created by the user
 * @function deleteCommentReply
 * @param {string} commentReplyId Id of the comment reply to vote on
 * @param {string} authToken A user's auth token
 */
export const deleteCommentReply = async (commentReplyId, authToken) => {
  await apiClient.delete(
    `/comment/${commentReplyId}/reply`,
    authHeader(authToken)
  );
};

/**
 * Votes on a comment reply
 * @function voteCommentReply
 * @param {string} commentReplyId Id of the comment reply to vote on
 * @param {string} authToken A user's auth token
 */
export const voteCommentReply = async (commentReplyId, authToken) => {
  await apiClient.post(
    `/comment/${commentReplyId}/replyVote`,
    null,
    authHeader(authToken)
  );
};

/**
 * Gets 3 new replies from a parent comment
 * @function getCommentReplies
 * @param {string} parentCommentId The id of a parent comment to get replies from
 * @param {number} offset A number to offset the results
 * @returns {array} Array of replies
 */
export const getCommentReplies = async (parentCommentId, offset = 0) => {
  const { data } = await apiClient.get(
    `/comment/${parentCommentId}/${offset}/replies`
  );
  return data;
};

/**
 * Retrieves comments from a post with the given offset
 * @function getComments
 * @param {string} postId The id of a post to retrieve comments from
 * @param {number} offset The amount of comments to skip
 * @param {number} exclude The amount of comments to exclude (newest to oldest)
 * @returns {object} Object of comment details
 */
export const getComments = async (postId, offset, exclude = 0) => {
  const { data } = await apiClient.get(
    `/comment/${postId}/${offset}/${exclude}`
  );
  return data;
};
