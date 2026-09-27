import { Fragment, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import { getHashtagPosts } from "../../services/postService";
import type { PostSummary } from "../../types";
import type { AlertClickHandler } from "../../redux/alert/alertSlice";

import MobileHeader from "../Header/MobileHeader/MobileHeader";
import TextButton from "../Button/TextButton/TextButton";
import PreviewImage from "../PreviewImage/PreviewImage";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import ImageGrid from "../ImageGrid/ImageGrid";

interface HashtagPostsProps {
  token: string | null;
  showModal: (props: Record<string, unknown>, component: string) => void;
  showAlert: (text: string, onClick?: AlertClickHandler) => void;
}

interface PostsState {
  posts: PostSummary[];
  postCount: number;
  fetching: boolean;
  hasMore: boolean;
}

const HashtagPosts = ({ token, showModal, showAlert }: HashtagPostsProps) => {
  const [posts, setPosts] = useState<PostsState>({
    posts: [],
    postCount: 0,
    fetching: false,
    hasMore: false,
  });

  // The route always supplies :hashtag.
  const { hashtag = "" } = useParams();
  const navigate = useNavigate();

  const handleClick = (postId: string, avatar?: string) => {
    if (window.outerWidth <= 600) {
      navigate(`/post/${postId}`);
    } else {
      showModal(
        {
          postId,
          avatar,
        },
        "PostDialog/PostDialog"
      );
    }
  };

  const retrievePosts = async (offset = 0) => {
    try {
      setPosts((previous) => ({ ...previous, fetching: true }));
      const response = await getHashtagPosts(token ?? "", hashtag, offset);
      response.posts
        ? setPosts((previous) => ({
            posts: previous.posts
              ? [...previous.posts, ...response.posts]
              : response.posts,
            postCount: response.postCount,
            fetching: false,
            hasMore: response.posts.length === 20,
          }))
        : setPosts((previous) => ({ ...previous, fetching: false }));
    } catch (err) {
      showAlert((err as Error).message);
    }
  };

  const renderSkeleton = (amount: number) => {
    const skeleton = [];
    for (let i = 0; i < amount; i++) {
      skeleton.push(
        <SkeletonLoader key={i} style={{ minHeight: "30rem" }} animated />
      );
    }
    return skeleton;
  };

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && posts.hasMore && !posts.fetching) {
        retrievePosts(posts.posts.length);
      }
    },
    null,
    [posts]
  );

  const retrievePostsRef = useRef(retrievePosts);

  useEffect(() => {
    retrievePostsRef.current();
  }, [retrievePostsRef]);

  return !posts.fetching && posts.posts.length === 0 ? (
    <div className="hashtag-posts__empty">
      <h2 className="heading-2">
        Could not find any post associated with #{hashtag}.
      </h2>
    </div>
  ) : (
    <Fragment>
      <MobileHeader backArrow>
        <TextButton style={{ justifySelf: "center" }} bold large>
          #{hashtag}
        </TextButton>
      </MobileHeader>
      <div className="hashtag-posts__title">
        <h2 className="heading-2">#{hashtag}</h2>
        <h3 className="heading-3 font-medium">
          <span className="font-bold">{posts.postCount}</span>{" "}
          {posts.postCount === 1 ? "post" : "posts"}
        </h3>
      </div>
      <ImageGrid>
        {posts.posts &&
          posts.posts.map((post, idx) => (
            <PreviewImage
              key={idx}
              image={post.thumbnail ?? post.image}
              likes={post.postVotes}
              comments={post.comments}
              filter={post.filter}
              onClick={() => handleClick(post._id, post.author.avatar)}
            />
          ))}
        {posts.fetching && renderSkeleton(10)}
      </ImageGrid>
    </Fragment>
  );
};

export default HashtagPosts;
