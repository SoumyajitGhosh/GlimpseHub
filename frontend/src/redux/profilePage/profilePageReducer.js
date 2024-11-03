import profilePageTypes from "./profilePageTypes";
export const INITIAL_STATE = {
    fetching: true,
    following: false,
    fetchingAdditionalPosts: false,
    error: false,
    data: {
        posts: [],
    },
};

const profilePageReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case profilePageTypes.FETCH_PROFILE_START: {
            return { ...state, fetching: true, error: false };
        }
        case profilePageTypes.FETCH_PROFILE_FAILURE: {
            return { ...state, fetching: false, error: action.payload };
        }
        case profilePageTypes.FETCH_PROFILE_SUCCESS: {
            return {
                ...state,
                fetching: false,
                error: false,
                data: {
                    ...action.payload,
                    posts: action.payload.posts ? action.payload.posts.data : [],
                    postCount: action.payload.posts ? action.payload.posts.postCount : 0,
                },
            };
        }
        case profilePageTypes.FOLLOW_USER_START: {
            return { ...state, following: true };
        }
        case profilePageTypes.FOLLOW_USER_FAILURE: {
            return { ...state, following: false, error: action.payload };
        }
        case profilePageTypes.FOLLOW_USER_SUCCESS: {
            if (action.payload === 'follow') {
                return {
                    ...state,
                    following: false,
                    data: {
                        ...state.data,
                        isFollowing: true,
                        followers: state.data.followers + 1,
                    },
                };
            }
            return {
                ...state,
                following: false,
                data: {
                    ...state.data,
                    isFollowing: false,
                    followers: state.data.followers - 1,
                },
            };
        }
        case profilePageTypes.FETCH_ADDITIONAL_POSTS_START: {
            return { ...state, fetchingAdditionalPosts: true };
        }
        case profilePageTypes.FETCH_ADDITIONAL_POSTS_FAILURE: {
            return {
                ...state,
                fetchingAdditionalPosts: false,
                error: action.payload,
            };
        }
        case profilePageTypes.FETCH_ADDITIONAL_POSTS_SUCCESS: {
            return { ...state, fetchingAdditionalPosts: false, error: false };
        }
        case profilePageTypes.ADD_POSTS: {
            const posts = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    posts: [...state.data.posts, ...posts],
                },
            };
        }
        default: return state;
    }
}

export default profilePageReducer;