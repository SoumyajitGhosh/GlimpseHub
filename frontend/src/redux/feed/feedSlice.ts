import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { retrieveFeedPosts } from "../../services/feedServices";
import type { AppDispatch, RootState } from "../store";
import type { Post } from "../../types";

const FEED_PAGE_SIZE = 5;

export interface FeedState {
  posts: Post[];
  fetching: boolean;
  error: string | false;
  hasMore: boolean;
}

const initialState: FeedState = {
  posts: [],
  fetching: true,
  error: false,
  hasMore: false,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    fetchStart(state) {
      state.fetching = true;
      state.error = false;
    },
    fetchSuccess(state, action: PayloadAction<Post[]>) {
      state.fetching = false;
      state.error = false;
      state.posts.push(...action.payload);
      state.hasMore = action.payload.length === FEED_PAGE_SIZE;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.fetching = false;
      state.error = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    removePost(state, action: PayloadAction<string>) {
      const index = state.posts.findIndex((post) => post._id === action.payload);
      if (index !== -1) state.posts.splice(index, 1);
    },
    clearPosts(state) {
      state.posts = [];
    },
  },
});

export const { addPost, removePost, clearPosts } = feedSlice.actions;
const { fetchStart, fetchSuccess, fetchFailure } = feedSlice.actions;

/**
 * Fetches the next page of feed posts and appends them.
 */
export const fetchFeedPostsStart =
  (authToken: string, offset?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchStart());
      const response = await retrieveFeedPosts(authToken, offset);
      dispatch(fetchSuccess(response));
    } catch (err) {
      dispatch(fetchFailure((err as Error).message));
    }
  };

const selectFeed = (state: RootState) => state.feed;
export const selectFeedPosts = createSelector([selectFeed], (feed) => feed.posts);
export const selectFeedError = createSelector([selectFeed], (feed) => feed.error);
export const selectFeedFetching = createSelector(
  [selectFeed],
  (feed) => feed.fetching
);
export const selectHasMore = createSelector([selectFeed], (feed) => feed.hasMore);

export default feedSlice.reducer;
