import React, { Fragment } from "react";
import Icon from "../Icon/Icon";

const ChatWindow = () => {
  return (
    <Fragment>
      <Icon
        icon={"chatbubble-ellipses-outline"}
        style={{ height: "150px", width: "150px" }}
      />
      <h1 style={{ fontWeight: 400 }}>Send private messages</h1>
    </Fragment>
  );
};

export default ChatWindow;