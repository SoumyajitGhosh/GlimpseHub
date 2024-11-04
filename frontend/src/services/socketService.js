import { io } from 'socket.io-client';

export const connect = () => {
  const socket = io('http://localhost:8586', { // Replace with your server URL
    transports: ['websocket'], // Ensure WebSocket is used as the transport method
    query: {
      token: localStorage.getItem('token'), // Add query parameters correctly
    },
  });

  return socket;
};
