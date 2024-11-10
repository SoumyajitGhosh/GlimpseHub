import { extractTime } from "../../../utils/extractTime";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectToken,
} from "../../../redux/user/userSelectors";
import { fetchAllMessagesAction } from "../../../redux/chat/chatActions";

const Chats = ({ userToChatId } /*{ message }*/) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const { chatUser } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchAllMessagesAction(userToChatId, token));
  }, []);
  console.log("messages:", messages);

  return (
    <div style={{ height: "100%" }}>
      <div className="chatbody-div">
        {messages?.map((message, idx) => (
          <>
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
          </>
        ))}
      </div>
    </div>
  );
};
export default Chats;
