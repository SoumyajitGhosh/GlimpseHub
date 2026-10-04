import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { retrieveUserFollowing } from "../../services/profileService";
import { getMessages, sendMessage } from "../../services/messageServices";
import type { AppDispatch, RootState } from "../store";
import type { ChatUser, Message } from "../../types";

export interface ChatState {
  fetching: boolean;
  fetchingAdditional: boolean;
  error: string | false;
  data: ChatUser[] | null;
  chatUser: ChatUser | null;
  /** The conversation currently open (route `:id`); null before any is opened. */
  activeChatId: string | null;
  messages: Message[];
  messageSending: boolean;
  messageSendingError: string | false;
}

export const INITIAL_STATE: ChatState = {
  fetching: true,
  fetchingAdditional: false,
  error: false,
  data: null,
  chatUser: null,
  activeChatId: null,
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
    fetchFailure(state, action: PayloadAction<string>) {
      state.fetching = false;
      state.fetchingAdditional = false;
      state.error = action.payload;
    },
    fetchSuccess(state, action: PayloadAction<ChatUser[]>) {
      state.fetching = false;
      state.fetchingAdditional = false;
      state.error = false;
      state.data = action.payload;
    },
    addUsers(state, action: PayloadAction<ChatUser[]>) {
      state.fetchingAdditional = false;
      state.data = [...(state.data ?? []), ...action.payload];
    },
    setChatUser(state, action: PayloadAction<string>) {
      if (state.activeChatId !== action.payload) {
        // Switching conversations: drop the previous thread so it can't bleed in.
        state.messages = [];
        state.activeChatId = action.payload;
      }
      state.chatUser =
        state.data?.find((datum) => datum._id === action.payload) ?? null;
    },
    fetchAllMessages(state, action: PayloadAction<Message[]>) {
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
    pushMessageSuccess(state, action: PayloadAction<Message>) {
      state.messageSending = false;
      state.messageSendingError = false;
      const msg = action.payload;
      const active = state.activeChatId;
      // Ignore messages belonging to a different conversation than the open one.
      if (active && msg.senderId !== active && msg.receiverId !== active) return;
      // The HTTP response and the socket echo both deliver the sender's message.
      if (state.messages.some((m) => m._id === msg._id)) return;
      state.messages.push(msg);
    },
    pushMessageFailure(state, action: PayloadAction<string>) {
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
  (userId: string, stateRefLength: number, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchStart());
      const response = await retrieveUserFollowing(userId, stateRefLength, token);
      dispatch(fetchSuccess(response));
    } catch (err) {
      dispatch(fetchFailure((err as Error).message));
    }
  };

/** Appends the next page of chattable users (sidebar infinite scroll). */
export const fetchChatUsersActionOnScroll =
  (userId: string, stateRefLength: number, token: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchAdditionalStart());
      const response = await retrieveUserFollowing(userId, stateRefLength, token);
      dispatch(addUsers(response));
    } catch (err) {
      dispatch(fetchFailure((err as Error).message));
    }
  };

/** Loads the full message history with a user. */
export const fetchAllMessagesAction =
  (userToChatId: string, token: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const response = await getMessages(userToChatId, token);
      // Discard a stale response if the user already switched conversations.
      const active = getState().chat.activeChatId;
      if (active && active !== userToChatId) return;
      dispatch(fetchAllMessages(response));
    } catch (err) {
      dispatch(fetchFailure((err as Error).message));
    }
  };

/** Sends a message and appends it (the socket echo is de-duplicated by _id). */
export const pushMessageAction =
  (id: string, authToken: string, message: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(pushMessageStart());
      const sent = await sendMessage(id, authToken, message);
      // Append from the HTTP response too, so the message shows even if the socket
      // is down; the socket echo is de-duplicated by _id.
      dispatch(pushMessageSuccess(sent));
    } catch (err) {
      dispatch(chatSlice.actions.pushMessageFailure((err as Error).message));
    }
  };

/** Appends a message received over the socket (also the sender's own echo). */
export const addSocketMessagesAction =
  (response: Message) => (dispatch: AppDispatch) => {
    dispatch(pushMessageSuccess(response));
  };

export default chatSlice.reducer;
