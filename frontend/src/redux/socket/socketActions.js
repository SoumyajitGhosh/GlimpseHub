import socketTypes from './socketTypes';
import { connect } from '../../services/socketService';
import { addNotification } from '../notification/notificationActions';
import { addPost, removePost } from '../feed/feedActions';
import { addSocketMessagesAction } from '../chat/chatActions';

export const connectSocket = () => (dispatch) => {
    const socket = connect();
    dispatch({ type: socketTypes.CONNECT, payload: socket });

    socket.on('newNotification', (data) => {
        dispatch(addNotification(data));
    });

    socket.on('newPost', (data) => {
        dispatch(addPost(data));
    });

    socket.on('deletePost', (data) => {
        dispatch(removePost(data));
    });

    socket.on('newMessage', (data) => {
        dispatch(addSocketMessagesAction(data));
    })
};

export const disconnectSocket = () => ({
    type: socketTypes.DISCONNECT,
});