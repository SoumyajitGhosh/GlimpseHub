import React, { Fragment } from "react";
import ChatUsers from "./ChatUsers/ChatUsers";
// import SearchBox from "../SearchBox/SearchBox";

const ChatSidebar = () => {
  return (
    <Fragment>
      {/* <SearchBox /> */}
      <main style={{ overflowY: "auto", height: "90vh" }}>
        <ChatUsers />
      </main>
    </Fragment>
  );
};

export default ChatSidebar;
