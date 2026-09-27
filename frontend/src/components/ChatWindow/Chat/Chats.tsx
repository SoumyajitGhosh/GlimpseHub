import { extractTime } from "../../../utils/extractTime";
import { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectCurrentUser, selectToken } from "../../../redux/user/userSlice";
import { fetchAllMessagesAction } from "../../../redux/chat/chatSlice";

const Chats = ({ userToChatId } /*{ message }*/) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const { chatUser } = useAppSelector((state) => state.chat);
  const { messages } = useAppSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchAllMessagesAction(userToChatId, token));
  }, [dispatch, userToChatId, token]);

  return (
    <div style={{ height: "100%" }}>
      <div className="chatbody-div">
        {messages?.map((message, idx) => (
          <Fragment key={message._id ?? idx}>
            {message.senderId === userToChatId ? (
              <p className="chat-receiver">
                <span
                  style={{
                    position: "absolute",
                    top: "-15px",
                    fontWeight: 800,
                    fontSize: "xx-small",
                  }}
                >
                  {chatUser?.username}
                </span>
                {message.message}
                <span>{extractTime(message.createdAt)}</span>
              </p>
            ) : (
              <p className="chat-sender">
                <span>{currentUser.username}</span>
                {message.message}
                <span>{extractTime(message.createdAt)}</span>
              </p>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
export default Chats;
