import ChatInput from "./ChatInput";
import Chats from "./Chats";
import { useAppSelector } from "../../../redux/hooks";

interface ChatContainerProps {
  userToChatId: string;
}

const ChatContainer = ({ userToChatId }: ChatContainerProps) => {
  const { chatUser } = useAppSelector((state) => state.chat);
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
