import { io } from "socket.io-client";

/**
 * The live socket.io connection is a module singleton — it is NOT stored in
 * Redux (a live socket is non-serializable and mutable). The socket slice
 * tracks only `{ connected, error }`; anything that needs the instance itself
 * imports `getSocket()` from here.
 */
let socket = null;

/** Opens a fresh connection, tearing down any existing one first. */
export const openSocket = () => {
  closeSocket();
  socket = io(import.meta.env.VITE_BACKEND_URI, {
    transports: ["websocket"],
    query: { token: localStorage.getItem("token") },
  });
  return socket;
};

/** The current socket instance, or null when disconnected. */
export const getSocket = () => socket;

/** Disconnects and forgets the current socket. */
export const closeSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
