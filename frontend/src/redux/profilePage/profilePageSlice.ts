import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { followUser, getUserProfile } from "../../services/profileService";
import { getPosts } from "../../services/postService";
import type { AppDispatch, RootState } from "../store";
import type { Post, ProfileResponse } from "../../types";

export interface ProfilePageData {
  posts: Post[];
  postCount?: number;
  followers?: number;
  following?: number;
  isFollowing?: boolean;
  [key: string]: unknown;
}

export interface ProfilePageState {
  fetching: boolean;
  following: boolean;
  fetchingAdditionalPosts: boolean;
  error: string | false;
  data: ProfilePageData;
}

export const INITIAL_STATE: ProfilePageState = {
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
    fetchProfileFailure(state, action: PayloadAction<string>) {
      state.fetching = false;
      state.error = action.payload;
    },
    fetchProfileSuccess(state, action: PayloadAction<ProfileResponse>) {
      state.fetching = false;
      state.error = false;
      const payload = action.payload;
      const rawPosts = payload.posts;
      state.data = {
        ...payload,
        posts: rawPosts
          ? Array.isArray(rawPosts)
            ? rawPosts
            : rawPosts.data
          : [],
        postCount:
          rawPosts && !Array.isArray(rawPosts) ? rawPosts.postCount : 0,
      };
    },
    followUserFailure(state, action: PayloadAction<string>) {
      state.following = false;
      state.error = action.payload;
    },
    followUserSuccess(state, action: PayloadAction<"follow" | "unfollow">) {
      state.following = false;
      if (action.payload === "follow") {
        state.data.isFollowing = true;
        state.data.followers = (state.data.followers ?? 0) + 1;
      } else {
        state.data.isFollowing = false;
        state.data.followers = (state.data.followers ?? 0) - 1;
      }
    },
    fetchAdditionalPostsStart(state) {
      state.fetchingAdditionalPosts = true;
    },
    fetchAdditionalPostsFailure(state, action: PayloadAction<string>) {
      state.fetchingAdditionalPosts = false;
      state.error = action.payload;
    },
    fetchAdditionalPostsSuccess(state) {
      state.fetchingAdditionalPosts = false;
      state.error = false;
    },
    addPosts(state, action: PayloadAction<Post[]>) {
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
export const fetchProfileAction =
  (username: string, token?: string | null) => async (dispatch: AppDispatch) => {
    dispatch(followUserStart());
    try {
      const profile = await getUserProfile(username, token);
      dispatch(fetchProfileSuccess(profile));
    } catch (err) {
      dispatch(fetchProfileFailure((err as Error).message));
    }
  };

/** Follows / unfollows a user and updates the follower count. */
export const followUserAction =
  (userId: string, token: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(followUserStart());
      const response = await followUser(userId, token);
      dispatch(followUserSuccess(response.operation));
    } catch (err) {
      dispatch(followUserFailure((err as Error).message));
    }
  };

/** Appends the next page of the profile's posts (infinite scroll). */
export const fetchingAdditionalPostsAction =
  (username: string, length: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchAdditionalPostsStart());
      const posts = await getPosts(username, length);
      dispatch(fetchAdditionalPostsSuccess());
      dispatch(addPosts(posts));
    } catch (err) {
      dispatch(fetchAdditionalPostsFailure((err as Error).message));
    }
  };

const selectProfile = (state: RootState) => state.profile;
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
