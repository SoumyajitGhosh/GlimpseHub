import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import {
  retrieveNotifications,
  readNotifications,
} from "../../services/notificationServices";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    fetching: false,
    error: false,
  },
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    fetchStart(state) {
      state.fetching = true;
      state.error = false;
    },
    fetchFailure(state, action) {
      state.fetching = false;
      state.error = action.payload;
    },
    fetchSuccess(state, action) {
      state.fetching = false;
      state.error = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(
        (notification) => notification.read === false
      ).length;
    },
    readNotificationsAction(state) {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;
const { fetchStart, fetchSuccess, fetchFailure, readNotificationsAction } =
  notificationSlice.actions;

/** Loads the user's notifications. */
export const fetchNotificationsStart = (authToken) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await retrieveNotifications(authToken);
    dispatch(fetchSuccess(response));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

/** Marks every notification read (optimistically, then on the server). */
export const readNotificationsStart = (authToken) => async (dispatch) => {
  try {
    dispatch(readNotificationsAction());
    await readNotifications(authToken);
  } catch (err) {
    console.warn(err.message);
  }
};

const selectNotificationsObject = (state) => state.notifications;
export const selectNotifications = createSelector(
  [selectNotificationsObject],
  (notifications) => notifications.notifications
);
export const selectNotificationState = createSelector(
  [selectNotificationsObject],
  (notifications) => notifications
);

export default notificationSlice.reducer;
