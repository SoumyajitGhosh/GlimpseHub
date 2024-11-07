import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import UserCard from "../UserCard/UserCard";
import Divider from "../Divider/Divider";

const ChatUsers = () => {
  const userCardProps = {
    username: "username",
    subTextDark: true,
    date: new Date(),
    style: { minHeight: "7rem", padding: "1rem 1.5rem" },
    subText: "Hey",
  };
  const ChatUserBody = () => {
    return (
      <Fragment>
        <Link to={`/`}>
          <img
            src={"S"}
            style={{
              display: "flex",
            }}
            onClick={() => {}}
            alt="liked post"
          />
        </Link>
      </Fragment>
    );
  };
  const ChatUser = () => {
    return <UserCard {...userCardProps}>{ChatUserBody}</UserCard>;
  };
  return [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ].map((chat, idx) => <ChatUser key={idx} />);
};

export default ChatUsers;
