import React, { Fragment, useEffect } from "react";
import Icon from "../Icon/Icon";
import { useParams } from "react-router-dom";
import ChatContainer from "./Chat/ChatContainer";
import { useDispatch } from "react-redux";
import { setChatUserAction } from "../../redux/chat/chatActions";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(setChatUserAction(id));
  }, [id]);
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
