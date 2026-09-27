import type { CSSProperties } from "react";
import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import { getSuggestedPosts } from "../../services/postService";
import type { PostSummary, User } from "../../types";
import type { AlertClickHandler } from "../../redux/alert/alertSlice";

import MobileHeader from "../Header/MobileHeader/MobileHeader";
import SearchBox from "../SearchBox/SearchBox";
import TextButton from "../Button/TextButton/TextButton";
import UserCard from "../UserCard/UserCard";
import PreviewImage from "../PreviewImage/PreviewImage";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import ImageGrid from "../ImageGrid/ImageGrid";

interface SuggestedPostsProps {
  token: string | null;
  showModal: (props: Record<string, unknown>, component: string) => void;
  showAlert: (text: string, onClick?: AlertClickHandler) => void;
}

interface PostsState {
  posts: PostSummary[] | null;
  fetching: boolean;
  hasMore: boolean;
}

const SuggestedPosts = ({ token, showModal, showAlert }: SuggestedPostsProps) => {
  const navigate = useNavigate();
  const [result, setResult] = useState<User[]>([]);
  const [search, setSearch] = useState(false);

  const [posts, setPosts] = useState<PostsState>({
    posts: null,
    fetching: false,
    hasMore: false,
  });

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
      const response = await getSuggestedPosts(token ?? "", offset);
      setPosts((previous) => ({
        posts: previous.posts
          ? [
              ...previous.posts,
              ...response.filter(
                (newPost) =>
                  !previous.posts!.some((post) => post._id === newPost._id)
              ),
            ]
          : response,
        fetching: false,
        hasMore: response.length >= 20,
      }));
    } catch (err) {
      showAlert((err as Error).message);
    }
  };

  const retrievePostsRef = useRef(retrievePosts);

  useEffect(() => {
    retrievePostsRef.current();
  }, [retrievePostsRef]);

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && posts.hasMore && !posts.fetching) {
        retrievePosts(posts.posts?.length ?? 0);
      }
    },
    null,
    [posts]
  );

  const renderSkeleton = (amount: number) => {
    const skeleton = [];
    for (let i = 0; i < amount; i++) {
      skeleton.push(
        <SkeletonLoader key={i} style={{ minHeight: "30rem" }} animated />
      );
    }
    return skeleton;
  };

  return (
    <Fragment>
      <MobileHeader
        style={
          search
            ? ({
                gridTemplateColumns: "repeat(2, 1fr) min-content",
                gridColumnGap: "2rem",
              } as CSSProperties)
            : undefined
        }
      >
        <SearchBox
          style={{ gridColumn: `${search ? "1 / span 2" : "1 / -1"}` }}
          setResult={setResult}
          onClick={() => setSearch(true)}
        />
        {search && (
          <TextButton onClick={() => setSearch(false)} bold large>
            Cancel
          </TextButton>
        )}
      </MobileHeader>
      {search ? (
        <div className="explore-users">
          {result.map((user) => (
            <UserCard
              key={user._id ?? user.username}
              avatar={user.avatar}
              username={user.username}
              subText={user.fullName}
            />
          ))}
        </div>
      ) : (
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
      )}
    </Fragment>
  );
};

export default SuggestedPosts;
