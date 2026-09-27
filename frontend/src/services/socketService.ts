import { io, type Socket } from "socket.io-client";

import type { Message, Notification, Post } from "../types";

/** Server → client socket events (see the real-time table in the project docs). */
export interface ServerToClientEvents {
  newNotification: (notification: Notification) => void;
  newPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  newMessage: (message: Message) => void;
  getOnlineUsers: (userIds: string[]) => void;
}

export type AppSocket = Socket<ServerToClientEvents>;

/**
 * The live socket.io connection is a module singleton — it is NOT stored in
 * Redux (a live socket is non-serializable and mutable). The socket slice
 * tracks only `{ connected, error }`; anything that needs the instance itself
 * imports `getSocket()` from here.
 */
let socket: AppSocket | null = null;

/** Opens a fresh connection, tearing down any existing one first. */
export const openSocket = (): AppSocket => {
  closeSocket();
  socket = io(import.meta.env.VITE_BACKEND_URI, {
    transports: ["websocket"],
    query: { token: localStorage.getItem("token") },
  });
  return socket;
};

/** The current socket instance, or null when disconnected. */
export const getSocket = (): AppSocket | null => socket;

/** Disconnects and forgets the current socket. */
export const closeSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
