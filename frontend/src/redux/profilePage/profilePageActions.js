import profilePageTypes from "./profilePageTypes";
import { followUser, getUserProfile, retrieveUserFollowers, retrieveUserFollowing } from "../../services/profileService";
import { getPosts } from "../../services/postService";

export const fetchProfileAction = (username, token) => async (dispatch) => {
    dispatch({ type: profilePageTypes.FOLLOW_USER_START });
    try {
        const profile = await getUserProfile(username, token);
        dispatch({ type: profilePageTypes.FETCH_PROFILE_SUCCESS, payload: profile });
    }
    catch (err) {
        dispatch({ type: profilePageTypes.FETCH_PROFILE_FAILURE, payload: err });
    }
}

export const followUserAction = (userId, token) => async (dispatch) => {
    try {
        dispatch({ type: profilePageTypes.FOLLOW_USER_START });
        const response = await followUser(userId, token);
        dispatch({
            type: profilePageTypes.FOLLOW_USER_SUCCESS,
            payload: response.operation,
        })
    }
    catch (err) {
        dispatch({
            type: profilePageTypes.FOLLOW_USER_FAILURE,
            payload: err,
        })
    }
}

export const fetchingAdditionalPostsAction = (username, length) => async (dispatch) => {
    try {
        dispatch({ type: profilePageTypes.FETCH_ADDITIONAL_POSTS_START });
        const posts = await getPosts(username, length);
        dispatch({ type: profilePageTypes.FETCH_ADDITIONAL_POSTS_SUCCESS });
        dispatch({ type: profilePageTypes.ADD_POSTS, payload: posts });
    } catch (err) {
        dispatch({
            type: profilePageTypes.FETCH_ADDITIONAL_POSTS_FAILURE,
            payload: err,
        });
    }
}

export const fetchAdditionalUsersAction = (userId, followingRef, stateRefLength, token) => async (dispatch) => {
    try {
        dispatch({ type: profilePageTypes.FETCH_START });
        const response = followingRef
            ? await retrieveUserFollowing(
                userId,
                stateRefLength,
                token
            )
            : await retrieveUserFollowers(
                userId,
                stateRefLength,
                token
            );
        dispatch({ type: profilePageTypes.FETCH_SUCCESS, payload: response });
    } catch (err) {
        dispatch({ type: profilePageTypes.FETCH_FAILURE, payload: err });
    }
};
