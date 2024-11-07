import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserCard from "../../UserCard/UserCard";
import Divider from "../../Divider/Divider";

const ChatUsers = () => {
  const userCardProps = {
    username: "username",
    subTextDark: true,
    date: new Date(),
    style: { minHeight: "7rem", padding: "1rem 1.5rem" },
    subText: "Hey",
    linkTo: `/direct/1`,
  };
  const ChatUserBody = () => {
    const navigate = useNavigate();
    return (
      <Fragment>
        <Link to={`/direct/1`}>
          <img
            src={"S"}
            style={{
              display: "flex",
            }}
            onClick={() => {
              navigate(`/direct/1`);
            }}
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
  ].map((chat, idx) => (
    <>
      <ChatUser key={idx} />
      <Divider />
    </>
  ));
};

export default ChatUsers;
