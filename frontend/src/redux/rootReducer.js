import { combineReducers } from 'redux';

import userReducer from './user/userReducer.js';
import modalReducer from './modal/modalReducer';
import alertReducer from './alert/alertReducer';
import socketReducer from './socket/socketReducer';
import notificationReducer from './notification/notificationReducer';
import feedReducer from './feed/feedReducer';
import profilePageReducer from './profilePage/profilePageReducer.js';
import chatReducer from './chat/chatReducer.js';

const rootReducer = combineReducers({
    user: userReducer,
    modal: modalReducer,
    alert: alertReducer,
    chat: chatReducer,
    socket: socketReducer,
    notifications: notificationReducer,
    feed: feedReducer,
    profile: profilePageReducer,
});

export default rootReducer;