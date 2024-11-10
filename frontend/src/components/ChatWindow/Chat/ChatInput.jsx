// import { useState } from "react";
// import { BsSend } from "react-icons/bs";
// import useSendMessage from "../../hooks/useSendMessage";xw
// const MessageInput = () => {
//   const [message, setMessage] = useState("");
//   const { loading, sendMessage } = useSendMessage();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message) return;
//     await sendMessage(message);
//     setMessage("");
//   };

//   return (
//     <form className="px-4 my-3" onSubmit={handleSubmit}>
//       <div className="w-full relative">
//         <input
//           type="text"
//           className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
//           placeholder="Send a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="absolute inset-y-0 end-0 flex items-center pe-3"
//         >
//           {loading ? (
//             <div className="loading loading-spinner"></div>
//           ) : (
//             <BsSend />
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };
// export default MessageInput;

// STARTER CODE SNIPPET
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../../Icon/Icon";
import { pushMessageAction } from "../../../redux/chat/chatActions.js";
import { selectToken } from "../../../redux/user/userSelectors.js";

const ChatInput = ({ userToChatId }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [message, setMessage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    dispatch(pushMessageAction(userToChatId, token, message));
    setMessage("");
  };
  return (
    <form className="message-input">
      <input
        type="text"
        style={{
          flex: 1, // Makes input take all available space
        }}
        value={message}
        placeholder="Send a message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Icon
        icon={"send"}
        style={{ cursor: "pointer" }}
        onClick={(e) => handleSubmit(e)}
      />
    </form>
  );
};

export default ChatInput;
