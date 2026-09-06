import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { retrieveFeedPosts } from "../../services/feedServices";

const FEED_PAGE_SIZE = 5;

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts: [],
    fetching: true,
    error: false,
    hasMore: false,
  },
  reducers: {
    fetchStart(state) {
      state.fetching = true;
      state.error = false;
    },
    fetchSuccess(state, action) {
      state.fetching = false;
      state.error = false;
      state.posts.push(...action.payload);
      state.hasMore = action.payload.length === FEED_PAGE_SIZE;
    },
    fetchFailure(state, action) {
      state.fetching = false;
      state.error = action.payload;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },
    removePost(state, action) {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload
      );
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
 * @param {string} authToken
 * @param {number} [offset]
 */
export const fetchFeedPostsStart = (authToken, offset) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await retrieveFeedPosts(authToken, offset);
    dispatch(fetchSuccess(response));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

const selectFeed = (state) => state.feed;
export const selectFeedPosts = createSelector(
  [selectFeed],
  (feed) => feed.posts
);
export const selectFeedError = createSelector(
  [selectFeed],
  (feed) => feed.error
);
export const selectFeedFetching = createSelector(
  [selectFeed],
  (feed) => feed.fetching
);
export const selectHasMore = createSelector(
  [selectFeed],
  (feed) => feed.hasMore
);

export default feedSlice.reducer;
