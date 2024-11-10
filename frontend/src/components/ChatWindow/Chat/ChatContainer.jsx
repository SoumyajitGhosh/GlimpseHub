import React from "react";
import ChatInput from "./ChatInput";
import Chats from "./Chats";
import { useSelector } from "react-redux";

const ChatContainer = ({ userToChatId }) => {
  const { chatUser } = useSelector((state) => state.chat);
  return (
    <div className="chat-container">
      <div className="chats">
        <Chats chatUser={chatUser} userToChatId={userToChatId} />
      </div>
      <div style={{ flexShrink: 0 }}>
        <ChatInput userToChatId={userToChatId} />
      </div>
    </div>
  );
};

export default ChatContainer;
