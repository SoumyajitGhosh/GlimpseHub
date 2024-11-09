import React, { Fragment } from "react";
import Icon from "../Icon/Icon";
import { useParams } from "react-router-dom";
import ChatContainer from "./Chat/ChatContainer";

const ChatWindow = () => {
  const { id } = useParams();
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
          <ChatContainer />
        </div>
      )}
    </Fragment>
  );
};

export default ChatWindow;