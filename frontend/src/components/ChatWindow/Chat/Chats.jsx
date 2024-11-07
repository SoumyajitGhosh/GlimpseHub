// import { useAuthContext } from "../../context/AuthContext";
// import { extractTime } from "../../utils/extractTime";
// import useConversation from "../../zustand/useConversation";

const Chats = (/*{ message }*/) => {
  // const { authUser } = useAuthContext();
  // const { selectedConversation } = useConversation();
  // const fromMe = message.senderId === authUser._id;
  // const formattedTime = extractTime(message.createdAt);
  const chatClassName = /*fromMe */ true ? "chat-end" : "chat-start";
  // const profilePic = fromMe
  //   ? authUser.profilePic
  //   : selectedConversation?.profilePic;
  // const bubbleBgColor = fromMe ? "bg-blue-500" : "";

  // const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div style={{ height: "100%" }}>
      <div className="chat-header">
        {/* <Avatar /> */}A
        <div style={{ flex: 1, paddingLeft: "20px" }}>
          <h5 style={{ fontWeight: 900 }}>{"receiver.name"}</h5>
        </div>
        <div>
          {/* <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton> */}
        </div>
      </div>

      <div className="chatbody-div">
        {/* Received Message */}
        <p className="chat-receiver">
          <span>{"receiver.name"}</span>
          This is a message
          <span>{new Date().toUTCString()}</span>
        </p>

        {/* Sent Message */}
        <p className="chat-sender">
          <span>{"sender.Name"}</span>
          This is a message
          <span>{new Date().toUTCString()}</span>
        </p>
      </div>

      {/* WRITE A NEW MESSAGE */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "60px",
          borderTop: "1px solid lightgray",
          background: "rgba(239, 239, 239, 0.9)",
        }}
      >
        <InsertEmoticonIcon
          style={{
            color: "gray",
            margin: "10px",
          }}
        />
        <form
          style={{
            flex: 1,
            display: "flex",
          }}
        >
          <input
            placeholder="Type a message"
            type="text"
            style={{
              flex: 1,
              display: "flex",
              borderRadius: "30px",
              padding: "10px",
              border: "none",
            }}
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
          />
          <button
            type="submit"
            style={{ display: "none" }}
            onClick={(e) => handleSendMsg}
          >
            Send a message
          </button>
        </form>
        <MicIcon
          onClick={(e) => handleSendMsg(typedMessage)}
          style={{
            color: "gray",
            margin: "10px",
          }}
        />
      </div> */}
    </div>
  );
};
export default Chats;
