import React, { Fragment, useEffect, useRef, useState } from "react";
import ChatUsers from "./ChatUsers/ChatUsers";
import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectToken } from "../../redux/user/userSelectors";
import { fetchProfileAction } from "../../redux/profilePage/profilePageActions";
import {
  fetchChatUsersAction,
  fetchChatUsersActionOnScroll,
} from "../../redux/chat/chatActions";

const ChatSidebar = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const { following } = useSelector((state) => state?.profile?.data);
  const { chat } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchProfileAction(currentUser?.username, token));
  }, []);

  useScrollPositionThrottled(async ({ atBottom }) => {
    const count = following;
    if (
      atBottom &&
      chat.data.length < count &&
      !chat.fetching &&
      !chat.fetchingAdditional
    ) {
      dispatch(
        fetchChatUsersActionOnScroll(
          currentUser._id,
          stateRef?.length ?? 0,
          token
        )
      );
    }
  }, componentRef.current);

  const stateRef = useRef(chat.data).current;

  useEffect(() => {
    stateRef.current = chattableUsers;
  }, [chattableUsers]);

  useEffect(() => {
    dispatch(
      fetchChatUsersAction(currentUser._id, stateRef?.length ?? 0, token)
    );
  }, [currentUser?._id, token, stateRef]);

  return (
    <Fragment>
      <section
        ref={componentRef}
        style={{
          overflowY: "auto",
          height: "90vh",
          borderRight: "1px solid #dbdbdb",
        }}
      >
        <ChatUsers chattableUsers={chat?.data} />
      </section>
    </Fragment>
  );
};

export default ChatSidebar;
