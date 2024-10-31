import React, { useEffect, useReducer, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";

import { selectToken, selectCurrentUser } from "../../redux/user/userSelectors";
import { showModal, hideModal } from "../../redux/modal/modalActions";
import { showAlert } from "../../redux/alert/alertActions";

import { getPost, deletePost } from "../../services/postService";
import { getComments } from "../../services/commentService";

import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import Comment from "../Comment/Comment";
import PostDialogCommentForm from "./PostDialogCommentForm/PostDialogCommentForm";
import PostDialogStats from "./PostDialogStats/PostDialogStats";

import { INITIAL_STATE, postDialogReducer } from "./postDialogReducer";

const PostDialog = ({
  postId,
  profileDispatch,
  style,
  className,
  postData,
  loading,
  simple,
}) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);

  const commentsRef = useRef();
  const [state, localDispatch] = useReducer(postDialogReducer, INITIAL_STATE);
  const navigate = useNavigate();

  const fetching = loading !== undefined ? loading : state.fetching;

  useEffect(() => {
    if (!loading) {
      if (postData) {
        localDispatch({ type: "FETCH_POST_SUCCESS", payload: postData });
      } else {
        window.history.pushState(
          { prevUrl: window.location.href },
          null,
          `/post/${postId}`
        );
        (async function () {
          try {
            const response = await getPost(postId);
            localDispatch({ type: "FETCH_POST_SUCCESS", payload: response });
          } catch (err) {
            navigate("/");
            localDispatch({ type: "FETCH_POST_FAILURE", payload: err });
          }
        })();
      }
    }

    return () => {
      if (window.history.state && window.history.state.prevUrl) {
        window.history.pushState(
          "profile",
          "Profile",
          window.history.state.prevUrl
        );
      }
    };
  }, [postId, navigate, loading, postData]);

  const fetchAdditionalComments = async () => {
    try {
      const commentData = await getComments(
        postId,
        state.data.comments.length,
        state.localStateComments.size
      );
      localDispatch({ type: "ADD_COMMENT", payload: commentData.comments });
    } catch (err) {
      dispatch(
        showAlert(
          "Unable to fetch additional comments.",
          fetchAdditionalComments
        )
      );
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId, token);
      profileDispatch &&
        profileDispatch({
          type: "DELETE_POST",
          payload: postId,
        });
      dispatch(hideModal("PostDialog/PostDialog"));
    } catch (err) {
      dispatch(showAlert("Unable to delete post.", handleDeletePost));
    }
  };

  return (
    <div
      className={classNames("post-dialog", {
        "post-dialog--simple": simple,
        [className]: className,
      })}
      data-test="component-post-dialog"
      style={style}
    >
      <Fragment>
        <div
          className={classNames("post-dialog__image", {
            "post-dialog__image--simple": simple,
          })}
        >
          {fetching ? (
            <SkeletonLoader animated />
          ) : (
            <img
              src={state.data.image}
              alt="Post"
              style={{ filter: state.data.filter }}
            />
          )}
        </div>
        <header
          className={classNames("post-dialog__header", {
            "post-dialog__header--simple": simple,
          })}
        >
          {fetching ? (
            <SkeletonLoader
              style={{ height: "4rem", width: "4rem", borderRadius: "100px" }}
            />
          ) : (
            <Link
              to={`/${state.data.author.username}`}
              style={{ display: "flex" }}
            >
              <Avatar
                className="avatar--small"
                imageSrc={state.data.author.avatar}
              />
            </Link>
          )}
          {fetching ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <SkeletonLoader style={{ height: "1rem", width: "10rem" }} />
              <SkeletonLoader
                style={{ height: "1rem", width: "15rem", marginTop: "5px" }}
              />
            </div>
          ) : (
            <Link
              style={{ textDecoration: "none" }}
              to={`/${state.data.author.username}`}
            >
              <p className="heading-4 heading-4--bold">
                <b>{state.data.author.username}</b>
              </p>
            </Link>
          )}
          {!fetching && (
            <div
              onClick={() => {
                const options = [
                  {
                    text: "Go to post",
                    onClick: () => {
                      dispatch(hideModal("PostDialog/PostDialog"));
                      navigate(`/post/${postId}`);
                    },
                  },
                  {
                    text: "Copy link",
                    onClick: () => {
                      navigator.clipboard
                        .writeText(document.URL)
                        .then(() =>
                          dispatch(showAlert("Link copied to clipboard."))
                        )
                        .catch(() =>
                          dispatch(
                            showAlert("Could not copy link to clipboard.")
                          )
                        );
                    },
                  },
                ];
                dispatch(
                  showModal(
                    {
                      options:
                        currentUser &&
                        currentUser.username === state.data.author.username
                          ? [
                              ...options,
                              {
                                text: "Delete post",
                                warning: true,
                                onClick: () => {
                                  handleDeletePost();
                                  navigate(`/${currentUser.username}`);
                                },
                              },
                            ]
                          : options,
                    },
                    "OptionsDialog/OptionsDialog"
                  )
                );
              }}
              style={{ cursor: "pointer" }}
              className="post-dialog__more"
            >
              <Icon className="icon--small" icon="ellipsis-horizontal" />
            </div>
          )}
        </header>
        <div
          data-test="component-post-dialog-content"
          className={classNames("post-dialog__content", {
            "post-dialog__content--simple": simple,
          })}
        >
          <div
            ref={commentsRef}
            className={classNames("comments", { "comments--simple": simple })}
          >
            {state.data.caption && !fetching && (
              <Comment
                comment={{
                  message: state.data.caption,
                  avatar: state.data.author.avatar,
                  username: state.data.author.username,
                }}
                currentUser={currentUser}
                token={token}
                post={state.data}
                caption
                simple={simple}
              />
            )}
            {!fetching &&
              state.data.comments.map((comment, idx) => (
                <Comment
                  comment={comment}
                  currentUser={currentUser}
                  token={token}
                  post={state.data}
                  key={idx}
                  dialogDispatch={localDispatch}
                  profileDispatch={profileDispatch}
                  simple={simple}
                />
              ))}
            {!postData &&
              state.data.comments.length - state.localStateComments.size <
                state.data.commentCount - state.localStateComments.size && (
                <div
                  style={{ padding: "2rem", cursor: "pointer" }}
                  onClick={fetchAdditionalComments}
                >
                  <Icon
                    style={{ margin: "0 auto" }}
                    icon="add-circle-outline"
                  />
                </div>
              )}
          </div>
          {fetching ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "2rem 2rem 6rem 2rem",
              }}
            >
              <SkeletonLoader style={{ height: "1.5rem", width: "15rem" }} />
              <SkeletonLoader
                style={{ height: "1.5rem", width: "20rem", marginTop: "1rem" }}
              />
              <SkeletonLoader
                style={{ height: "1.5rem", width: "10rem", marginTop: "1rem" }}
              />
            </div>
          ) : (
            <PostDialogStats
              currentUser={currentUser}
              token={token}
              post={state.data}
              dispatch={localDispatch}
              profileDispatch={profileDispatch}
              simple={simple}
            />
          )}
          {!fetching && (
            <PostDialogCommentForm
              postId={postId}
              token={token}
              currentUser={currentUser}
              commentsRef={commentsRef}
              dialogDispatch={localDispatch}
              profileDispatch={profileDispatch}
              replying={state.replying}
            />
          )}
        </div>
      </Fragment>
    </div>
  );
};

PostDialog.propTypes = {
  postId: PropTypes.string,
  profileDispatch: PropTypes.func,
};

PostDialog.whyDidYouRender = true;

export default PostDialog;
