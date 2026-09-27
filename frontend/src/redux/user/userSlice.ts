import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { disconnectSocket } from "../socket/socketSlice";
import { bookmarkPost as bookmarkPostService } from "../../services/postService";
import { registerUser, login } from "../../services/authenticationServices";
import {
  changeAvatar,
  removeAvatar,
  updateProfile,
} from "../../services/userService";
import type { AppDispatch, RootState } from "../store";
import type { BookmarkResponse, CurrentUser, LoginResponse, ProfileUpdates } from "../../types";

export interface UserState {
  currentUser: CurrentUser | null;
  error: string | false;
  fetching: boolean;
  fetchingAvatar: boolean;
  updatingProfile: boolean;
  token: string | null;
}

export const INITIAL_STATE: UserState = {
  currentUser: null,
  error: false,
  fetching: false,
  fetchingAvatar: false,
  updatingProfile: false,
  token: localStorage.getItem("token"),
};

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    authStart(state) {
      state.error = false;
      state.fetching = true;
    },
    authSuccess(state, action: PayloadAction<LoginResponse>) {
      state.currentUser = action.payload.user;
      state.error = false;
      state.fetching = false;
      state.token = action.payload.token;
    },
    authFailure(state, action: PayloadAction<string>) {
      state.fetching = false;
      state.error = action.payload;
    },
    signedOut(state) {
      state.currentUser = null;
      state.token = null;
    },
    bookmarkToggled(
      state,
      action: PayloadAction<BookmarkResponse & { postId: string }>
    ) {
      const { operation, postId } = action.payload;
      if (!state.currentUser) return;
      const bookmarks = state.currentUser.bookmarks ?? [];
      if (operation === "add") {
        state.currentUser.bookmarks = [...bookmarks, { post: postId }];
      } else {
        state.currentUser.bookmarks = bookmarks.filter(
          (bookmark) => bookmark.post !== postId
        );
      }
    },
    avatarRequestStart(state) {
      state.fetchingAvatar = true;
    },
    avatarChanged(state, action: PayloadAction<string>) {
      if (state.currentUser) state.currentUser.avatar = action.payload;
      state.fetchingAvatar = false;
    },
    avatarRemoved(state) {
      if (state.currentUser) delete state.currentUser.avatar;
      state.fetchingAvatar = false;
      state.error = false;
    },
    avatarRequestFailed(state, action: PayloadAction<string>) {
      state.fetchingAvatar = false;
      state.error = action.payload;
    },
    profileUpdateStart(state) {
      state.updatingProfile = true;
    },
    profileUpdated(state, action: PayloadAction<Partial<CurrentUser>>) {
      state.error = false;
      state.updatingProfile = false;
      state.currentUser = { ...state.currentUser, ...action.payload } as CurrentUser;
    },
    profileUpdateFailed(state, action: PayloadAction<string>) {
      state.updatingProfile = false;
      state.error = action.payload;
    },
  },
});

const {
  authStart,
  authSuccess,
  authFailure,
  signedOut,
  bookmarkToggled,
  avatarRequestStart,
  avatarChanged,
  avatarRemoved,
  avatarRequestFailed,
  profileUpdateStart,
  profileUpdated,
  profileUpdateFailed,
} = userSlice.actions;

/** Persists the token and stores the signed-in user. */
export const signInSuccess = (response: LoginResponse) => (dispatch: AppDispatch) => {
  localStorage.setItem("token", response.token);
  dispatch(authSuccess(response));
};

export const signInFailure = (message: string) => authFailure(message);

/** Clears the token, disconnects the socket, and resets the user slice. */
export const signOut = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  dispatch(disconnectSocket());
  dispatch(signedOut());
};

/**
 * Logs in with credentials, or resumes a session from a stored token. A failed
 * token-resume signs the user out so the bad token doesn't linger.
 */
export const signInStart =
  (
    usernameOrEmail: string | null,
    password: string | null,
    authToken?: string | null
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());
      const response = await login(usernameOrEmail, password, authToken);
      dispatch(signInSuccess(response));
    } catch (err) {
      if (authToken) dispatch(signOut());
      dispatch(signInFailure((err as Error).message));
    }
  };

/** Registers a new user, then immediately signs them in with the new token. */
export const signUpStart =
  (email: string, fullName: string, username: string, password: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(authStart());
      const response = await registerUser(email, fullName, username, password);
      dispatch(signInStart(null, null, response.token));
    } catch (err) {
      dispatch(authFailure((err as Error).message));
    }
  };

/** Toggles a bookmark on a post. */
export const bookmarkPost =
  (postId: string, authToken: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await bookmarkPostService(postId, authToken);
      dispatch(bookmarkToggled({ ...response, postId }));
    } catch (err) {
      return err;
    }
  };

/** Uploads a new avatar. */
export const changeAvatarStart =
  (formData: Blob, authToken: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(avatarRequestStart());
      const response = await changeAvatar(formData, authToken);
      dispatch(avatarChanged(response.avatar));
    } catch (err) {
      dispatch(avatarRequestFailed((err as Error).message));
    }
  };

/** Removes the current avatar. */
export const removeAvatarStart =
  (authToken: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(avatarRequestStart());
      await removeAvatar(authToken);
      dispatch(avatarRemoved());
    } catch (err) {
      dispatch(avatarRequestFailed((err as Error).message));
    }
  };

/** Updates profile fields on the current user. */
export const updateProfileStart =
  (authToken: string, updates: ProfileUpdates) => async (dispatch: AppDispatch) => {
    try {
      dispatch(profileUpdateStart());
      const response = await updateProfile(authToken, updates);
      dispatch(profileUpdated(response));
    } catch (err) {
      dispatch(profileUpdateFailed((err as Error).message));
    }
  };

const selectUser = (state: RootState) => state.user;
export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);
export const selectError = createSelector([selectUser], (user) => user.error);
export const selectToken = createSelector([selectUser], (user) => user.token);
export const selectFetching = createSelector(
  [selectUser],
  (user) => user.fetching
);
export const selectFetchingAvatar = createSelector(
  [selectUser],
  (user) => user.fetchingAvatar
);
export const selectUpdatingProfile = createSelector(
  [selectUser],
  (user) => user.updatingProfile
);

export default userSlice.reducer;
