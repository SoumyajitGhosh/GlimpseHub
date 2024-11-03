import { createSelector } from 'reselect';

const selectProfile = (state) => state.profile;

export const fetchingAdditionalPostsProfile = createSelector(
    [selectProfile],
    (profile) => profile.fetchingAdditionalPosts
);

export const selectProfileError = createSelector(
    [selectProfile],
    (profile) => profile.error
);

export const selectProfileFollowing = createSelector(
    [selectProfile],
    (profile) => profile.following
)

export const selectProfileFetching = createSelector(
    [selectProfile],
    (profile) => profile.fetching
);

export const selectProfileData = createSelector(
    [selectProfile],
    (profile) => profile.data
);