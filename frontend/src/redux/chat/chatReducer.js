import chatTypes from "./chatTypes";
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

const chatReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case chatTypes.FETCH_START: {
            return { ...state, fetching: true, error: false };
        }
        case chatTypes.FETCH_ADDITIONAL_START: {
            return {
                ...state,
                fetching: false,
                error: false,
                fetchingAdditional: true,
            };
        }
        case chatTypes.FETCH_FAILURE: {
            return {
                ...state,
                fetching: false,
                fetchingAdditional: false,
                error: action.payload,
            };
        }
        case chatTypes.FETCH_SUCCESS: {
            return {
                ...state,
                fetching: false,
                fetchingAdditional: false,
                error: false,
                data: action.payload,
            };
        }
        case chatTypes.ADD_USERS: {
            return {
                ...state,
                fetchingAdditional: false,
                data: [...state.data, ...action.payload],
            };
        }
        case chatTypes.SET_CHAT_USER: {
            const filteredUser = state.data?.find((datum) => datum._id === action.payload);
            return {
                ...state,
                chatUser: filteredUser, // `filteredUser` will be an object or undefined if not found
            };
        }        
        case chatTypes.FETCH_ALL_MESSAGES: {
            const newMessages = action.payload;

            if (newMessages.length === 0) {
                return {
                    ...state,
                    messages: []
                };
            }

            return {
                ...state,
                messages: [
                    ...state.messages,
                    ...newMessages.filter(
                        (newMessage) =>
                            !state.messages.some(
                                (existingMessage) => existingMessage._id === newMessage._id
                            )
                    ),
                ],
            };
        }
        case chatTypes.PUSH_MESSAGE_START: {
            return { ...state, messageSending: true, messageSendingError: false };
        }
        case chatTypes.PUSH_MESSAGE_SUCCESS: {
            const newMessage = action.payload;

            return {
                ...state,
                messageSending: false,
                messageSendingError: false,
                messages: [...state.messages, newMessage]
            };
        }
        case chatTypes.PUSH_MESSAGE_FAILURE: {
            return {
                ...state,
                messageSending: false,
                messageSendingError: action.payload
            }
        }
        default: return state;
    }
};

export default chatReducer;