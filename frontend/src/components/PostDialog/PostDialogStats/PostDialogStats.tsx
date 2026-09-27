/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import type { Dispatch } from "react";
import classNames from "classnames";

import { useAppDispatch } from "../../../redux/hooks";
import { bookmarkPost as bookmarkPostThunk } from "../../../redux/user/userSlice";
import { showAlert as showAlertAction } from "../../../redux/alert/alertSlice";
import {
  showModal as showModalAction,
  hideModal as hideModalAction,
} from "../../../redux/modal/modalSlice";

import { formatDate } from "../../../utils/timeUtils";
import { votePost } from "../../../services/postService";

import Icon from "../../Icon/Icon";
import PulsatingIcon from "../../Icon/PulsatingIcon/PulsatingIcon";
import LoginCard from "../../LoginCard/LoginCard";
import type { CurrentUser } from "../../../types";

interface PostDialogStatsProps {
  currentUser?: CurrentUser | null;
  post: any;
  token?: string | null;
  dispatch: Dispatch<any>;
  profileDispatch?: Dispatch<any>;
  simple?: boolean;
}

const PostDialogStats = ({
  currentUser,
  post,
  token,
  dispatch,
  profileDispatch,
  simple,
}: PostDialogStatsProps) => {
  const reduxDispatch = useAppDispatch();
  const bookmarkPost = (postId: string, authToken: string | null) =>
    reduxDispatch(bookmarkPostThunk(postId, authToken ?? ""));
  const showAlert = (text: string, onClick?: () => void) =>
    reduxDispatch(showAlertAction(text, onClick ?? null));
  const showModal = (props: Record<string, unknown>, component: string) =>
    reduxDispatch(showModalAction(props, component));
  const hideModal = (component: string) =>
    reduxDispatch(hideModalAction(component));

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    if (!currentUser) {
      return showModal(
        {
          children: <LoginCard onClick={() => hideModal("Card/Card")} modal />,
          style: {
            gridColumn: "center-start / center-end",
            justifySelf: "center",
            width: "40rem",
          },
        },
        "Card/Card"
      );
    }
    // Dispatch the action immediately to avoid a delay between the user's click and something happening
    dispatch({
      type: "VOTE_POST",
      payload: { currentUser, postId: post._id, dispatch: profileDispatch },
    });
    try {
      await votePost(post._id, token ?? "");
    } catch {
      showAlert("Could not vote on the post.", () => handleClick());
    }
  };

  const postDialogStatsClassNames = classNames({
    "post-dialog__stats": true,
    "post-dialog__stats--simple": simple,
  });

  return (
    <div
      ref={ref}
      className={postDialogStatsClassNames}
      data-test="component-post-dialog-stats"
    >
      <div className="post-dialog__actions">
        {currentUser ? (
          <PulsatingIcon
            toggle={
              !!post.postVotes.find(
                (vote: any) => vote.author === currentUser._id
              )
            }
            elementRef={ref}
            constantProps={{
              onClick: () => handleClick(),
            }}
            toggledProps={[
              {
                className: "icon--button post-dialog__like color-red",
                icon: "heart",
              },
              {
                className: "icon--button post-dialog__like",
                icon: "heart-outline",
              },
            ]}
          />
        ) : (
          <Icon
            onClick={() => handleClick()}
            icon="heart-outline"
            className="icon--button post-dialog__like"
          />
        )}
        <Icon
          onClick={() =>
            currentUser &&
            (
              document.querySelector(
                ".add-comment__input"
              ) as HTMLElement | null
            )?.focus()
          }
          className="icon--button"
          icon="chatbubble-outline"
        />
        <Icon className="icon--button" icon="paper-plane-outline" />
        <Icon
          className="icon--button"
          onClick={() => bookmarkPost(post._id, token ?? null)}
          icon={
            currentUser && currentUser.bookmarks
              ? currentUser.bookmarks.find(
                  (bookmark) => bookmark.post === post._id
                )
                ? "bookmark"
                : "bookmark-outline"
              : "bookmark-outline"
          }
        />
      </div>
      <p className="heading-4">
        {post.postVotes.length === 0 ? (
          <span>
            Be the first to{" "}
            <b
              style={{ cursor: "pointer" }}
              onClick={(event) => {
                event.nativeEvent.stopImmediatePropagation();
                handleClick();
              }}
              data-test="component-like-button"
            >
              like this
            </b>
          </span>
        ) : (
          <span>
            <b>
              {post.postVotes.length}{" "}
              {post.postVotes.length === 1 ? "like" : "likes"}
            </b>
          </span>
        )}
      </p>
      <p className="heading-5 color-light uppercase">{formatDate(post.date)}</p>
    </div>
  );
};

export default PostDialogStats;
