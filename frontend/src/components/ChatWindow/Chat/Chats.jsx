import { extractTime } from "../../../utils/extractTime";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectToken,
} from "../../../redux/user/userSelectors";
import { fetchAllMessagesAction } from "../../../redux/chat/chatSlice";

const Chats = ({ userToChatId } /*{ message }*/) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const { chatUser } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.chat);

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
