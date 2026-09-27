import apiClient, { authHeader } from "./apiClient";
import type { Comment, CommentReply, CommentsResponse } from "../types";

/**
 * Creates a comment on a specific post.
 */
export const createComment = async (
  message: string,
  postId: string,
  authToken: string
): Promise<Comment> => {
  const { data } = await apiClient.post<Comment>(
    `/comment/${postId}`,
    { message },
    authHeader(authToken)
  );
  return data;
};

/**
 * Deletes a comment with a specified comment id provided it was created by the user.
 */
export const deleteComment = async (
  commentId: string,
  authToken: string
): Promise<void> => {
  await apiClient.delete(`/comment/${commentId}`, authHeader(authToken));
};

/**
 * Votes on a comment.
 */
export const voteComment = async (
  commentId: string,
  authToken: string
): Promise<void> => {
  await apiClient.post(`/comment/${commentId}/vote`, null, authHeader(authToken));
};

/**
 * Creates a reply to a specific comment.
 */
export const createCommentReply = async (
  message: string,
  parentCommentId: string,
  authToken: string
): Promise<CommentReply> => {
  const { data } = await apiClient.post<CommentReply>(
    `/comment/${parentCommentId}/reply`,
    { message },
    authHeader(authToken)
  );
  return data;
};

/**
 * Deletes a comment reply provided it was created by the user.
 */
export const deleteCommentReply = async (
  commentReplyId: string,
  authToken: string
): Promise<void> => {
  await apiClient.delete(`/comment/${commentReplyId}/reply`, authHeader(authToken));
};

/**
 * Votes on a comment reply.
 */
export const voteCommentReply = async (
  commentReplyId: string,
  authToken: string
): Promise<void> => {
  await apiClient.post(
    `/comment/${commentReplyId}/replyVote`,
    null,
    authHeader(authToken)
  );
};

/**
 * Gets 3 new replies from a parent comment.
 */
export const getCommentReplies = async (
  parentCommentId: string,
  offset = 0
): Promise<CommentReply[]> => {
  const { data } = await apiClient.get<CommentReply[]>(
    `/comment/${parentCommentId}/${offset}/replies`
  );
  return data;
};

/**
 * Retrieves comments from a post with the given offset.
 */
export const getComments = async (
  postId: string,
  offset: number,
  exclude = 0
): Promise<CommentsResponse> => {
  const { data } = await apiClient.get<CommentsResponse>(
    `/comment/${postId}/${offset}/${exclude}`
  );
  return data;
};
