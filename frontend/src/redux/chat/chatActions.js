import { retrieveUserFollowing } from "../../services/profileService";
import chatTypes from "./chatTypes";
import { getMessages, sendMessage } from "../../services/messageServices";

export const fetchChatUsersAction = (userId, stateRefLength, token) => async (dispatch) => {
    try {
        dispatch({ type: chatTypes.FETCH_START });
        const response =
            await retrieveUserFollowing(
                userId,
                stateRefLength,
                token
            )
        dispatch({ type: chatTypes.FETCH_SUCCESS, payload: response });
    } catch (err) {
        console.log("Here:", err)
        dispatch({ type: chatTypes.FETCH_FAILURE, payload: err });
    }
};

export const fetchChatUsersActionOnScroll = (userId, stateRefLength, token) => async (dispatch) => {
    try {
        dispatch({ type: chatTypes.FETCH_ADDITIONAL_START });
        const response = await retrieveUserFollowing(userId, stateRefLength, token)
        dispatch({ type: chatTypes.ADD_USERS, payload: response });
    } catch (err) {
        dispatch({ type: chatTypes.FETCH_FAILURE, payload: err });
    }
}

export const setChatUserAction = (userId) => async (dispatch) => {
    dispatch({ type: chatTypes.SET_CHAT_USER, payload: userId });
}

export const fetchAllMessagesAction = (userToChatId, token) => async (dispatch) => {
    try {
        const response = await getMessages(userToChatId, token);
        dispatch({ type: chatTypes.FETCH_ALL_MESSAGES, payload: response });
    } catch (err) {
        dispatch({ type: chatTypes.FETCH_FAILURE, payload: err });
    }
}

export const pushMessageAction = (id, authToken, message) => async (dispatch) => {
    try {
        dispatch({ type: chatTypes.PUSH_MESSAGE_START });
        const response = await sendMessage(id, authToken, message);
        dispatch({ types: chatTypes.PUSH_MESSAGE_SUCCESS, payload: response });
    }
    catch (err) {
        dispatch({ type: chatTypes.PUSH_MESSAGE_FAILURE, payload: err });
    }
}

export const addSocketMessagesAction = (response) => async (dispatch) => {
    dispatch({ type: chatTypes.PUSH_MESSAGE_SUCCESS, payload: response });
}