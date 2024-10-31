import React, { Fragment } from 'react';
import { useSelector } from "react-redux";

import {
    selectFeedPosts,
    selectFeedFetching,
} from '../../redux/feed/feedSelectors';

import PostDialog from '../PostDialog/PostDialog';
import FeedBottom from './FeedBottom/FeedBottom';

const Feed = () => {
  const feedPosts = useSelector(selectFeedPosts);
  const feedFetching = useSelector(selectFeedFetching);

  return (
    <section className="feed">
      {feedPosts &&
        feedPosts.map((post, idx) => (
          <PostDialog simple postData={post} postId={post._id} key={idx} />
        ))}
      {feedFetching && (
        <Fragment>
          <PostDialog simple loading />
          <PostDialog simple loading />
          <PostDialog simple loading />
        </Fragment>
      )}
      {!feedFetching && feedPosts.length > 0 && <FeedBottom />}
    </section>
  );
};

export default Feed;
