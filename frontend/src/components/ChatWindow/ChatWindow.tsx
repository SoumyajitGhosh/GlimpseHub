import { Fragment, useEffect } from "react";
import Icon from "../Icon/Icon";
import { useParams } from "react-router-dom";
import ChatContainer from "./Chat/ChatContainer";
import { useAppDispatch } from "../../redux/hooks";
import { setChatUserAction } from "../../redux/chat/chatSlice";

const ChatWindow = () => {
  const dispatch = useAppDispatch();
  // The route always supplies :id (see App.tsx's /direct/:id).
  const { id = "" } = useParams();
  useEffect(() => {
    dispatch(setChatUserAction(id));
  }, [dispatch, id]);
  return (
    <Fragment>
      {id === "inbox" ? (
        <Fragment>
          <Icon
            icon={"chatbubble-ellipses-outline"}
            style={{ height: "150px", width: "150px" }}
          />
          <h1 style={{ fontWeight: 400 }}>Send private messages</h1>
        </Fragment>
      ) : (
        <div className="chat-container">
          <ChatContainer userToChatId={id} />
        </div>
      )}
    </Fragment>
  );
};

export default ChatWindow;
