import React, { Fragment, useEffect } from "react";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";
import NewPostButton from "../../components/NewPost/NewPostButton/NewPostButton";
import Icon from "../../components/Icon/Icon";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";

const ChatPage = () => {
  useEffect(() => {
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  return (
    <Fragment>
      <MobileHeader>
        <NewPostButton />
        <h3 style={{ fontSize: "2.5rem" }} className="heading-logo">
          GlimpseHub
        </h3>
        <Icon icon="paper-plane-outline" />
      </MobileHeader>
      <main data-test="page-chat" className="chat-page grid">
        <div style={{ border: "1px solid lightgray" }}>
          <ChatSidebar />
        </div>
        <div className="chat-window">
          <ChatWindow />
        </div>
      </main>
    </Fragment>
  );
};

export default ChatPage;
