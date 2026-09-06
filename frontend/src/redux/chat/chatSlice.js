import { createSlice } from "@reduxjs/toolkit";

import { retrieveUserFollowing } from "../../services/profileService";
import { getMessages, sendMessage } from "../../services/messageServices";

export const INITIAL_STATE = {
  fetching: true,
  fetchingAdditional: false,
  error: false,
  data: null,
  chatUser: {},
  messages: [],
  messageSending: true,
  messageSendingError: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: INITIAL_STATE,
  reducers: {
    fetchStart(state) {
      state.fetching = true;
      state.error = false;
    },
    fetchAdditionalStart(state) {
      state.fetching = false;
      state.error = false;
      state.fetchingAdditional = true;
    },
    fetchFailure(state, action) {
      state.fetching = false;
      state.fetchingAdditional = false;
      state.error = action.payload;
    },
    fetchSuccess(state, action) {
      state.fetching = false;
      state.fetchingAdditional = false;
      state.error = false;
      state.data = action.payload;
    },
    addUsers(state, action) {
      state.fetchingAdditional = false;
      state.data = [...(state.data ?? []), ...action.payload];
    },
    setChatUser(state, action) {
      state.chatUser = state.data?.find(
        (datum) => datum._id === action.payload
      );
    },
    fetchAllMessages(state, action) {
      const newMessages = action.payload;
      if (newMessages.length === 0) {
        state.messages = [];
        return;
      }
      const known = new Set(state.messages.map((m) => m._id));
      state.messages.push(...newMessages.filter((m) => !known.has(m._id)));
    },
    pushMessageStart(state) {
      state.messageSending = true;
      state.messageSendingError = false;
    },
    pushMessageSuccess(state, action) {
      state.messageSending = false;
      state.messageSendingError = false;
      state.messages.push(action.payload);
    },
    pushMessageFailure(state, action) {
      state.messageSending = false;
      state.messageSendingError = action.payload;
    },
  },
});

export const { setChatUser: setChatUserAction } = chatSlice.actions;
const {
  fetchStart,
  fetchAdditionalStart,
  fetchFailure,
  fetchSuccess,
  addUsers,
  fetchAllMessages,
  pushMessageStart,
  pushMessageSuccess,
} = chatSlice.actions;

/** Loads the first page of chattable users (the people the viewer follows). */
export const fetchChatUsersAction =
  (userId, stateRefLength, token) => async (dispatch) => {
    try {
      dispatch(fetchStart());
      const response = await retrieveUserFollowing(
        userId,
        stateRefLength,
        token
      );
      dispatch(fetchSuccess(response));
    } catch (err) {
      dispatch(fetchFailure(err.message));
    }
  };

/** Appends the next page of chattable users (sidebar infinite scroll). */
export const fetchChatUsersActionOnScroll =
  (userId, stateRefLength, token) => async (dispatch) => {
    try {
      dispatch(fetchAdditionalStart());
      const response = await retrieveUserFollowing(
        userId,
        stateRefLength,
        token
      );
      dispatch(addUsers(response));
    } catch (err) {
      dispatch(fetchFailure(err.message));
    }
  };

/** Loads the full message history with a user. */
export const fetchAllMessagesAction =
  (userToChatId, token) => async (dispatch) => {
    try {
      const response = await getMessages(userToChatId, token);
      dispatch(fetchAllMessages(response));
    } catch (err) {
      dispatch(fetchFailure(err.message));
    }
  };

/**
 * Sends a message. Note: the pre-RTK code dispatched a `{ types: ... }` typo on
 * success, so the sent message was never appended here — it arrives instead via
 * the `newMessage` socket echo (`addSocketMessagesAction`). Behaviour is kept:
 * this thunk only flips the sending flag, and the socket echo appends + clears it.
 */
export const pushMessageAction =
  (id, authToken, message) => async (dispatch) => {
    try {
      dispatch(pushMessageStart());
      await sendMessage(id, authToken, message);
    } catch (err) {
      dispatch(chatSlice.actions.pushMessageFailure(err.message));
    }
  };

/** Appends a message received over the socket (also the sender's own echo). */
export const addSocketMessagesAction = (response) => (dispatch) => {
  dispatch(pushMessageSuccess(response));
};

export default chatSlice.reducer;
