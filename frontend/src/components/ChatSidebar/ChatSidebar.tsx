import { Fragment, useEffect, useRef } from "react";
import ChatUsers from "./ChatUsers/ChatUsers";
import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectCurrentUser, selectToken } from "../../redux/user/userSlice";
import { fetchProfileAction } from "../../redux/profilePage/profilePageSlice";
import {
  fetchChatUsersAction,
  fetchChatUsersActionOnScroll,
} from "../../redux/chat/chatSlice";

const ChatSidebar = () => {
  const componentRef = useRef();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);
  const { following } = useAppSelector((state) => state?.profile?.data);
  const { chat } = useAppSelector((state) => state);
  const stateRef = useRef(chat?.data);

  useEffect(() => {
    // Intentional one-time fetch of the viewer's own profile on mount;
    // re-running on currentUser/token changes would refetch on every render
    // where the selector returns a new reference.
    dispatch(fetchProfileAction(currentUser?.username, token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          stateRef.current?.length ?? 0,
          token
        )
      );
    }
  }, componentRef);

  // useEffect(() => {
  //   if (chat.data.length) stateRef.current = chat.data;
  // }, [chat.data]);

  useEffect(() => {
    dispatch(
      fetchChatUsersAction(
        currentUser._id,
        /*stateRef.current?.length ??*/ 0,
        token
      )
    );
  }, [dispatch, currentUser?._id, token]);

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
