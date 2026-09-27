/* eslint-disable @typescript-eslint/no-explicit-any -- matches the loose
   Dispatch<any> convention already used for `profileDispatch` in Comment.tsx,
   CommentReply.tsx, PostDialog.tsx, and PostDialogStats.tsx. */
import { useReducer, Fragment, useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, FormEvent, RefObject } from "react";
import { Link } from "react-router-dom";

import {
  createComment,
  createCommentReply,
} from "../../../services/commentService";

import {
  INITIAL_STATE,
  postDialogCommentFormReducer,
} from "./postDialogFormReducer";
import type { PostDialogAction } from "../postDialogReducer";

import useSearchUsersDebounced from "../../../hooks/useSearchUsersDebounced";
import type { CurrentUser } from "../../../types";

import Loader from "../../Loader/Loader";
import SearchSuggestion from "../../SearchSuggestion/SearchSuggestion";

/** Mirrors `postDialogReducer.tsx`'s `SET_REPLYING` case: either not replying, or the comment being replied to. */
type Replying = false | { commentUser: string; commentId: string };

interface PostDialogCommentFormProps {
  token: string | null;
  postId: string;
  commentsRef: RefObject<HTMLDivElement | null>;
  dialogDispatch: Dispatch<PostDialogAction>;
  profileDispatch?: Dispatch<any>;
  replying: Replying;
  currentUser: CurrentUser | null;
}

const PostDialogCommentForm = ({
  token,
  postId,
  commentsRef,
  dialogDispatch,
  profileDispatch,
  replying,
  currentUser,
}: PostDialogCommentFormProps) => {
  const [state, dispatch] = useReducer(
    postDialogCommentFormReducer,
    INITIAL_STATE
  );
  const [mention, setMention] = useState<string | null>(null);
  // The hook's `result` is non-nullable `User[]` (see useSearchUsersDebounced.ts),
  // so visibility of the mention dropdown is tracked separately here rather than
  // by a null sentinel on `result` (which this component used to rely on).
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);

  let { handleSearchDebouncedRef, result, setResult, fetching, setFetching } =
    useSearchUsersDebounced();

  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replying && commentInputRef.current) {
      commentInputRef.current.value = `@${replying.commentUser} `;
      commentInputRef.current.focus();
    }
  }, [replying]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.comment.length === 0) {
      return dispatch({
        type: "POST_COMMENT_FAILURE",
        payload: "You cannot post an empty comment.",
      });
    }

    try {
      setResult([]);
      setShowMentionSuggestions(false);
      dispatch({ type: "POST_COMMENT_START" });
      if (!replying) {
        // The user is not replying to a comment
        const comment = await createComment(state.comment, postId, token ?? "");
        dispatch({
          type: "POST_COMMENT_SUCCESS",
          payload: { comment, dispatch: dialogDispatch, postId },
        });
        // Scroll to bottom to see posted comment
        if (commentsRef.current) {
          commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
        }
      } else {
        // The user is replying to a comment
        const comment = await createCommentReply(
          state.comment,
          replying.commentId,
          token ?? ""
        );
        dispatch({
          type: "POST_COMMENT_REPLY_SUCCESS",
          payload: {
            comment,
            dispatch: dialogDispatch,
            parentCommentId: replying.commentId,
          },
        });
        dialogDispatch({ type: "SET_REPLYING" });
      }
      // Increment the comment count on the overlay of the image on the profile page
      profileDispatch &&
        profileDispatch({
          type: "INCREMENT_POST_COMMENTS_COUNT",
          payload: postId,
        });
    } catch (err) {
      dispatch({ type: "POST_COMMENT_FAILURE", payload: err });
    }
  };

  return (
    <form
      onSubmit={(event) => handleSubmit(event)}
      className="post-dialog__add-comment"
      data-test="component-post-dialog-add-comment"
    >
      <Fragment>
        {currentUser ? (
          <Fragment>
            {state.posting && <Loader />}
            <input
              className="add-comment__input"
              type="text"
              aria-label="Add a comment"
              placeholder="Add a comment..."
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                // Removed the `@username` from the input so the user is no longer looking to reply
                if (replying && !event.target.value) {
                  dialogDispatch({ type: "SET_REPLYING" });
                }
                dispatch({ type: "SET_COMMENT", payload: event.target.value });
                // Checking for an @ mention
                let string = event.target.value.match(
                  new RegExp(/@[a-zA-Z0-9]+$/)
                );
                if (string) {
                  setShowMentionSuggestions(true);
                  setMention(() => {
                    setFetching(true);
                    const mention = string[0].substring(1);
                    // Setting the result to an empty array to show skeleton
                    setResult([]);
                    handleSearchDebouncedRef(mention);
                    return mention;
                  });
                } else {
                  setShowMentionSuggestions(false);
                  setResult([]);
                }
              }}
              value={state.comment}
              ref={commentInputRef}
              data-test="component-add-comment-input"
            />
            <button
              type="submit"
              className="heading-3 heading--button font-bold color-blue"
            >
              Post
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <h4 className="heading-4 font-medium color-grey">
              <span>
                <Link to="/login" className="link">
                  Log in
                </Link>{" "}
              </span>
              to like or comment.
            </h4>
          </Fragment>
        )}
      </Fragment>
      {showMentionSuggestions && (
        <SearchSuggestion
          fetching={fetching}
          result={result}
          username={mention ?? ""}
          onClick={(user) => {
            let comment = commentInputRef.current?.value ?? "";
            // Replace the last word with the @mention
            dispatch({
              type: "SET_COMMENT",
              payload: comment.replace(/@\b(\w+)$/, `@${user.username} `),
            });
            commentInputRef.current?.focus();
            setResult([]);
            setShowMentionSuggestions(false);
          }}
        />
      )}
    </form>
  );
};

export default PostDialogCommentForm;
