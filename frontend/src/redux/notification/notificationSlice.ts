import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import {
  retrieveNotifications,
  readNotifications,
} from "../../services/notificationServices";
import type { AppDispatch, RootState } from "../store";
import type { Notification } from "../../types";

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetching: boolean;
  error: string | false;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  fetching: false,
  error: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    fetchStart(state) {
      state.fetching = true;
      state.error = false;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.fetching = false;
      state.error = action.payload;
    },
    fetchSuccess(state, action: PayloadAction<Notification[]>) {
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

export const { addNotification, clearNotifications } = notificationSlice.actions;
const { fetchStart, fetchSuccess, fetchFailure, readNotificationsAction } =
  notificationSlice.actions;

/** Loads the user's notifications. */
export const fetchNotificationsStart =
  (authToken: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchStart());
      const response = await retrieveNotifications(authToken);
      dispatch(fetchSuccess(response));
    } catch (err) {
      dispatch(fetchFailure((err as Error).message));
    }
  };

/** Marks every notification read (optimistically, then on the server). */
export const readNotificationsStart =
  (authToken: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(readNotificationsAction());
      await readNotifications(authToken);
    } catch (err) {
      console.warn((err as Error).message);
    }
  };

const selectNotificationsObject = (state: RootState) => state.notifications;
export const selectNotifications = createSelector(
  [selectNotificationsObject],
  (notifications) => notifications.notifications
);
export const selectNotificationState = createSelector(
  [selectNotificationsObject],
  (notifications) => notifications
);

export default notificationSlice.reducer;
