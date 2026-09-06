import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { followUser, getUserProfile } from "../../services/profileService";
import { getPosts } from "../../services/postService";

export const INITIAL_STATE = {
  fetching: true,
  following: false,
  fetchingAdditionalPosts: false,
  error: false,
  data: {
    posts: [],
  },
};

const profilePageSlice = createSlice({
  name: "profile",
  initialState: INITIAL_STATE,
  reducers: {
    // Dispatched at the start of both a profile fetch and a follow toggle —
    // preserved from the pre-RTK code, which reused FOLLOW_USER_START for the
    // profile fetch too.
    followUserStart(state) {
      state.following = true;
    },
    fetchProfileFailure(state, action) {
      state.fetching = false;
      state.error = action.payload;
    },
    fetchProfileSuccess(state, action) {
      state.fetching = false;
      state.error = false;
      const payload = action.payload;
      state.data = {
        ...payload,
        posts: payload.posts ? payload.posts.data : [],
        postCount: payload.posts ? payload.posts.postCount : 0,
      };
    },
    followUserFailure(state, action) {
      state.following = false;
      state.error = action.payload;
    },
    followUserSuccess(state, action) {
      state.following = false;
      if (action.payload === "follow") {
        state.data.isFollowing = true;
        state.data.followers += 1;
      } else {
        state.data.isFollowing = false;
        state.data.followers -= 1;
      }
    },
    fetchAdditionalPostsStart(state) {
      state.fetchingAdditionalPosts = true;
    },
    fetchAdditionalPostsFailure(state, action) {
      state.fetchingAdditionalPosts = false;
      state.error = action.payload;
    },
    fetchAdditionalPostsSuccess(state) {
      state.fetchingAdditionalPosts = false;
      state.error = false;
    },
    addPosts(state, action) {
      state.data.posts.push(...action.payload);
    },
  },
});

const {
  followUserStart,
  fetchProfileFailure,
  fetchProfileSuccess,
  followUserFailure,
  followUserSuccess,
  fetchAdditionalPostsStart,
  fetchAdditionalPostsFailure,
  fetchAdditionalPostsSuccess,
  addPosts,
} = profilePageSlice.actions;

/** Loads a user's profile (and their first page of posts). */
export const fetchProfileAction = (username, token) => async (dispatch) => {
  dispatch(followUserStart());
  try {
    const profile = await getUserProfile(username, token);
    dispatch(fetchProfileSuccess(profile));
  } catch (err) {
    dispatch(fetchProfileFailure(err.message));
  }
};

/** Follows / unfollows a user and updates the follower count. */
export const followUserAction = (userId, token) => async (dispatch) => {
  try {
    dispatch(followUserStart());
    const response = await followUser(userId, token);
    dispatch(followUserSuccess(response.operation));
  } catch (err) {
    dispatch(followUserFailure(err.message));
  }
};

/** Appends the next page of the profile's posts (infinite scroll). */
export const fetchingAdditionalPostsAction =
  (username, length) => async (dispatch) => {
    try {
      dispatch(fetchAdditionalPostsStart());
      const posts = await getPosts(username, length);
      dispatch(fetchAdditionalPostsSuccess());
      dispatch(addPosts(posts));
    } catch (err) {
      dispatch(fetchAdditionalPostsFailure(err.message));
    }
  };

const selectProfile = (state) => state.profile;
export const fetchingAdditionalPostsProfile = createSelector(
  [selectProfile],
  (profile) => profile.fetchingAdditionalPosts
);
export const selectProfileError = createSelector(
  [selectProfile],
  (profile) => profile.error
);
export const selectProfileFollowing = createSelector(
  [selectProfile],
  (profile) => profile.following
);
export const selectProfileFetching = createSelector(
  [selectProfile],
  (profile) => profile.fetching
);
export const selectProfileData = createSelector(
  [selectProfile],
  (profile) => profile.data
);

export default profilePageSlice.reducer;
