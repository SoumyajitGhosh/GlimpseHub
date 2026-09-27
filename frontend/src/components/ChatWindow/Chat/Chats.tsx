import { extractTime } from "../../../utils/extractTime";
import { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectCurrentUser, selectToken } from "../../../redux/user/userSlice";
import { fetchAllMessagesAction } from "../../../redux/chat/chatSlice";
import type { ChatUser } from "../../../types";

interface ChatsProps {
  userToChatId: string;
  // Accepted for call-site convenience (ChatContainer passes the same value
  // this component already re-selects from the store below); not used directly.
  chatUser?: ChatUser | null;
}

const Chats = ({ userToChatId }: ChatsProps) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const { chatUser } = useAppSelector((state) => state.chat);
  const { messages } = useAppSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchAllMessagesAction(userToChatId, token ?? ""));
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
                {/* Chats only renders inside ChatPage, gated by ProtectedRoute. */}
                <span>{currentUser!.username}</span>
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
