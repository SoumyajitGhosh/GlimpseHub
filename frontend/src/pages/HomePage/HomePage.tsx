import { useEffect, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { selectCurrentUser, selectToken } from "../../redux/user/userSlice";
import {
  selectFeedPosts,
  selectHasMore,
  selectFeedFetching,
  fetchFeedPostsStart,
  clearPosts,
} from "../../redux/feed/feedSlice";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";

import Feed from "../../components/Feed/Feed";
import UserCard from "../../components/UserCard/UserCard";
import SmallFooter from "../../components/Footer/SmallFooter/SmallFooter";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import Icon from "../../components/Icon/Icon";
import NewPostButton from "../../components/NewPost/NewPostButton/NewPostButton";
import SuggestedUsers from "../../components/Suggestion/SuggestedUsers/SuggestedUsers";

const HomePage = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);
  const feedPosts = useAppSelector(selectFeedPosts);
  const hasMore = useAppSelector(selectHasMore);
  const fetching = useAppSelector(selectFeedFetching);

  useEffect(() => {
    document.title = `GlimpseHub`;
    dispatch(fetchFeedPostsStart(token));
    return () => {
      dispatch(clearPosts());
    };
  }, [dispatch, token]);

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && hasMore && !fetching) {
        dispatch(fetchFeedPostsStart(token, feedPosts.length));
      }
    },
    null,
    [hasMore, fetching, token, dispatch, feedPosts.length]
  );

  return (
    <Fragment>
      <MobileHeader>
        <NewPostButton />
        <h3 style={{ fontSize: "2.5rem" }} className="heading-logo">
          GlimpseHub
        </h3>
        <Icon icon="paper-plane-outline" />
      </MobileHeader>
      <main data-test="page-home" className="home-page grid">
        {!fetching && feedPosts.length === 0 ? (
          <SuggestedUsers card />
        ) : (
          <Fragment>
            <Feed />
            <aside className="sidebar">
              <div className="sidebar__content">
                <UserCard
                  avatar={currentUser.avatar}
                  username={currentUser.username}
                  subText={currentUser.fullName}
                  style={{ padding: "0" }}
                  avatarMedium
                />
                <SuggestedUsers max={5} style={{ width: "100%" }} />
                <SmallFooter />
              </div>
            </aside>
          </Fragment>
        )}
      </main>
    </Fragment>
  );
};

export default HomePage;
