import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { openSocket, closeSocket } from "../../services/socketService";
import { addNotification } from "../notification/notificationSlice";
import { addPost, removePost } from "../feed/feedSlice";
import { addSocketMessagesAction } from "../chat/chatSlice";
import type { AppDispatch } from "../store";

export interface SocketState {
  connected: boolean;
  error: string | null;
}

const initialState: SocketState = { connected: false, error: null };

/**
 * Tracks only serializable connection status. The live socket instance lives
 * in socketService as a module singleton (see getSocket).
 */
const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnected(state) {
      state.connected = true;
      state.error = null;
    },
    socketDisconnected(state) {
      state.connected = false;
    },
    socketError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

const { socketConnected, socketDisconnected, socketError } = socketSlice.actions;

/**
 * Opens the socket connection and wires every server -> client event to the
 * relevant slice action. Re-dispatching (e.g. on a token change) tears down the
 * previous connection first.
 */
export const connectSocket = () => (dispatch: AppDispatch) => {
  const socket = openSocket();

  socket.on("connect", () => dispatch(socketConnected()));
  socket.on("disconnect", () => dispatch(socketDisconnected()));
  socket.on("connect_error", (err) => dispatch(socketError(err.message)));

  socket.on("newNotification", (data) => dispatch(addNotification(data)));
  socket.on("newPost", (data) => dispatch(addPost(data)));
  socket.on("deletePost", (data) => dispatch(removePost(data)));
  socket.on("newMessage", (data) => dispatch(addSocketMessagesAction(data)));
};

/** Closes the socket (on sign-out). */
export const disconnectSocket = () => (dispatch: AppDispatch) => {
  closeSocket();
  dispatch(socketDisconnected());
};

export default socketSlice.reducer;
