import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";
import { showModal, hideModal } from "../../redux/modal/modalActions";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";

import ProfileCategory from "../../components/ProfileCategory/ProfileCategory";
import PreviewImage from "../../components/PreviewImage/PreviewImage";
import Loader from "../../components/Loader/Loader";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import SettingsButton from "../../components/SetttingsButton/SettingsButton";
import LoginCard from "../../components/LoginCard/LoginCard";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import ProfileHeader from "./ProfileHeader";
import EmptyProfile from "./EmptyProfile";
import {
  fetchProfileAction,
  fetchingAdditionalPostsAction,
  followUserAction,
} from "../../redux/profilePage/profilePageActions";
import {
  fetchingAdditionalPostsProfile,
  selectProfileData,
  selectProfileError,
  selectProfileFetching,
  selectProfileFollowing,
} from "../../redux/profilePage/profilePageSelectors";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

  const fetching = useSelector(selectProfileFetching);
  const following = useSelector(selectProfileFollowing);
  const fetchingAdditionalPosts = useSelector(fetchingAdditionalPostsProfile);
  const error = useSelector(selectProfileError);
  const data = useSelector(selectProfileData);

  const follow = async () => {
    if (!currentUser) {
      return dispatch(
        showModal(
          {
            children: (
              <LoginCard
                onClick={() => dispatch(hideModal("Card/Card"))}
                modal
              />
            ),
            style: {
              gridColumn: "center-start / center-end",
              justifySelf: "center",
              width: "40rem",
            },
          },
          "Card/Card"
        )
      );
    }
    dispatch(followUserAction(data.user._id, token));
    dispatch(fetchProfileAction(username, token));
  };

  useScrollPositionThrottled(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      data.posts.length < data.postCount &&
      !fetchingAdditionalPosts
    ) {
      dispatch(fetchingAdditionalPostsAction(username, data.posts.length));
    }
  }, null);

  useEffect(() => {
    document.title = `@${username} • GlimpseHub photos`;
    dispatch(fetchProfileAction(username, token));
  }, [username, token]);

  const handleClick = (postId) => {
    if (window.outerWidth <= 600) {
      navigate(`/post/${postId}`);
    } else {
      dispatch(
        showModal(
          {
            postId,
            avatar: data.avatar,
            profileDispatch: dispatch,
          },
          "PostDialog/PostDialog"
        )
      );
    }
  };

  const renderProfile = () => {
    if (fetching) {
      return <Loader />;
    }
    if (!fetching && data) {
      return (
        <Fragment>
          <ProfileHeader
            currentUser={currentUser}
            showModal={showModal}
            token={token}
            follow={follow}
          />
          <ProfileCategory category="POSTS" icon="apps-outline" />
          {data.posts.length > 0 ? (
            <div className="profile-images">
              {data.posts.map((post, idx) => (
                <PreviewImage
                  onClick={() => handleClick(post._id)}
                  image={post.image}
                  likes={post.postVotes}
                  comments={post.comments}
                  filter={post.filter}
                  key={idx}
                />
              ))}
              {fetchingAdditionalPosts && (
                <Fragment>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                  <div>
                    <SkeletonLoader animated />
                  </div>
                </Fragment>
              )}
            </div>
          ) : (
            <EmptyProfile
              currentUserProfile={
                currentUser && currentUser.username === username
              }
              username={username}
            />
          )}
        </Fragment>
      );
    }
  };

  return error ? (
    <NotFoundPage />
  ) : (
    <Fragment>
      {currentUser && currentUser.username === username ? (
        <MobileHeader>
          <SettingsButton />
          <h3 className="heading-3">{username}</h3>
          <div></div>
        </MobileHeader>
      ) : (
        <MobileHeader backArrow>
          <h3 className="heading-3">{username}</h3>
          <div></div>
        </MobileHeader>
      )}
      <main className="profile-page grid">{renderProfile()}</main>
    </Fragment>
  );
};

export default ProfilePage;
