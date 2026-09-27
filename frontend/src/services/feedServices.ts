import apiClient, { authHeader } from "./apiClient";
import type { FeedPostsResponse } from "../types";

/**
 * Retrieves posts from the user's feed.
 */
export const retrieveFeedPosts = async (
  authToken: string,
  offset = 0
): Promise<FeedPostsResponse> => {
  const { data } = await apiClient.get<FeedPostsResponse>(
    `/post/feed/${offset}`,
    authHeader(authToken)
  );
  return data;
};
