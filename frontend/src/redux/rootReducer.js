import { combineReducers } from "redux";

import userReducer from "./user/userReducer.js";
import modalReducer from "./modal/modalSlice";
import alertReducer from "./alert/alertSlice";
import socketReducer from "./socket/socketReducer";
import notificationReducer from "./notification/notificationSlice";
import feedReducer from "./feed/feedSlice";
import profilePageReducer from "./profilePage/profilePageSlice";
import chatReducer from "./chat/chatSlice";

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
