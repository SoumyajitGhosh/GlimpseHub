import apiClient, { authHeader } from "./apiClient";
import type {
  BookmarkResponse,
  HashtagPostsResponse,
  Post,
  PostFiltersResponse,
  ProfilePost,
  SuggestedPostsResponse,
} from "../types";

/**
 * Fetches a complete post with comments and the fully sized image instead of a
 * thumbnail image.
 */
export const getPost = async (postId: string): Promise<Post> => {
  const { data } = await apiClient.get<Post>(`/post/${postId}`);
  return data;
};

/**
 * Retrieves a page of a user's posts (profile grid pagination). `comments`/
 * `postVotes` here are pre-aggregated counts, not raw arrays — see
 * {@link ProfilePost}.
 */
export const getPosts = async (
  username: string,
  offset = 0
): Promise<ProfilePost[]> => {
  const { data } = await apiClient.get<ProfilePost[]>(
    `/user/${username}/posts/${offset}`
  );
  return data;
};

/**
 * Either likes or dislikes a post.
 */
export const votePost = async (postId: string, authToken: string): Promise<void> => {
  await apiClient.post(`/post/${postId}/vote`, null, authHeader(authToken));
};

/**
 * Sends an image and a caption as multipart/form-data and creates a post.
 */
export const createPost = async (
  formData: FormData,
  authToken: string
): Promise<Post> => {
  const { data } = await apiClient.post<Post>("/post", formData, {
    headers: {
      authorization: authToken,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/**
 * Deletes a post.
 */
export const deletePost = async (postId: string, authToken: string): Promise<void> => {
  await apiClient.delete(`/post/${postId}`, authHeader(authToken));
};

/**
 * Toggles bookmarking a post.
 */
export const bookmarkPost = async (
  postId: string,
  authToken: string
): Promise<BookmarkResponse> => {
  const { data } = await apiClient.post<BookmarkResponse>(
    `/user/${postId}/bookmark`,
    null,
    authHeader(authToken)
  );
  return data;
};

/**
 * Retrieves all filters.
 */
export const getPostFilters = async (): Promise<PostFiltersResponse> => {
  const { data } = await apiClient.get<PostFiltersResponse>("/post/filters");
  return data;
};

/**
 * Gets suggested posts.
 */
export const getSuggestedPosts = async (
  authToken: string,
  offset = 0
): Promise<SuggestedPostsResponse> => {
  const { data } = await apiClient.get<SuggestedPostsResponse>(
    `/post/suggested/${offset}`,
    authHeader(authToken)
  );
  return data;
};

/**
 * Gets posts associated with a specific hashtag.
 */
export const getHashtagPosts = async (
  authToken: string,
  hashtag: string,
  offset = 0
): Promise<HashtagPostsResponse> => {
  const { data } = await apiClient.get<HashtagPostsResponse>(
    `/post/hashtag/${hashtag}/${offset}`,
    authHeader(authToken)
  );
  return data;
};
