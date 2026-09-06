import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { disconnectSocket } from "../socket/socketSlice";
import { bookmarkPost as bookmarkPostService } from "../../services/postService";
import { registerUser, login } from "../../services/authenticationServices";
import {
  changeAvatar,
  removeAvatar,
  updateProfile,
} from "../../services/userService";

export const INITIAL_STATE = {
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
    authSuccess(state, action) {
      state.currentUser = action.payload.user;
      state.error = false;
      state.fetching = false;
      state.token = action.payload.token;
    },
    authFailure(state, action) {
      state.fetching = false;
      state.error = action.payload;
    },
    signedOut(state) {
      state.currentUser = null;
      state.token = null;
    },
    bookmarkToggled(state, action) {
      const { operation, postId } = action.payload;
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
    avatarChanged(state, action) {
      state.currentUser.avatar = action.payload;
      state.fetchingAvatar = false;
    },
    avatarRemoved(state) {
      delete state.currentUser.avatar;
      state.fetchingAvatar = false;
      state.error = false;
    },
    avatarRequestFailed(state, action) {
      state.fetchingAvatar = false;
      state.error = action.payload;
    },
    profileUpdateStart(state) {
      state.updatingProfile = true;
    },
    profileUpdated(state, action) {
      state.error = false;
      state.updatingProfile = false;
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    profileUpdateFailed(state, action) {
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
export const signInSuccess = (response) => (dispatch) => {
  localStorage.setItem("token", response.token);
  dispatch(authSuccess(response));
};

export const signInFailure = (message) => authFailure(message);

/** Clears the token, disconnects the socket, and resets the user slice. */
export const signOut = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(disconnectSocket());
  dispatch(signedOut());
};

/**
 * Logs in with credentials, or resumes a session from a stored token. A failed
 * token-resume signs the user out so the bad token doesn't linger.
 */
export const signInStart =
  (usernameOrEmail, password, authToken) => async (dispatch) => {
    try {
      dispatch(authStart());
      const response = await login(usernameOrEmail, password, authToken);
      dispatch(signInSuccess(response));
    } catch (err) {
      if (authToken) dispatch(signOut());
      dispatch(signInFailure(err.message));
    }
  };

/** Registers a new user, then immediately signs them in with the new token. */
export const signUpStart =
  (email, fullName, username, password) => async (dispatch) => {
    try {
      dispatch(authStart());
      const response = await registerUser(email, fullName, username, password);
      dispatch(signInStart(null, null, response.token));
    } catch (err) {
      dispatch(authFailure(err.message));
    }
  };

/** Toggles a bookmark on a post. */
export const bookmarkPost = (postId, authToken) => async (dispatch) => {
  try {
    const response = await bookmarkPostService(postId, authToken);
    dispatch(bookmarkToggled({ ...response, postId }));
  } catch (err) {
    return err;
  }
};

/** Uploads a new avatar. */
export const changeAvatarStart = (formData, authToken) => async (dispatch) => {
  try {
    dispatch(avatarRequestStart());
    const response = await changeAvatar(formData, authToken);
    dispatch(avatarChanged(response.avatar));
  } catch (err) {
    dispatch(avatarRequestFailed(err.message));
  }
};

/** Removes the current avatar. */
export const removeAvatarStart = (authToken) => async (dispatch) => {
  try {
    dispatch(avatarRequestStart());
    await removeAvatar(authToken);
    dispatch(avatarRemoved());
  } catch (err) {
    dispatch(avatarRequestFailed(err.message));
  }
};

/** Updates profile fields on the current user. */
export const updateProfileStart = (authToken, updates) => async (dispatch) => {
  try {
    dispatch(profileUpdateStart());
    const response = await updateProfile(authToken, updates);
    dispatch(profileUpdated(response));
  } catch (err) {
    dispatch(profileUpdateFailed(err.message));
  }
};

const selectUser = (state) => state.user;
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
