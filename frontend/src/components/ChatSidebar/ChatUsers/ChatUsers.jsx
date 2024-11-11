import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserCard from "../../UserCard/UserCard";
import Divider from "../../Divider/Divider";
import { useSelector } from "react-redux";

const ChatUsers = ({ chattableUsers }) => {
  const navigate = useNavigate();
  const { chatUser } = useSelector((state) => state.chat);

  const ChatUserBody = ({ userCardProps }) => {
    return (
      <Fragment>
        <Link to={userCardProps.linkTo}>
          <img
            src={"S"}
            style={{
              display: "flex",
            }}
            onClick={() => {
              navigate(userCardProps.linkTo);
            }}
          />
        </Link>
      </Fragment>
    );
  };
  const ChatUser = ({ id, userCardProps }) => {
    return <UserCard {...userCardProps}>{ChatUserBody}</UserCard>;
  };
  return chattableUsers?.map((chattableUser, idx) => {
    const userCardProps = {
      username: chattableUser?.username,
      subTextDark: true,
      avatar: chattableUser?.avatar,
      // date: new Date(),
      style: { minHeight: "7rem", padding: "1rem 1.5rem" },
      subText: chattableUser?.fullName,
      linkTo: `/direct/${chattableUser?._id}`,
    };
    return (
      <div
        onClick={() => {
          navigate(`/direct/${chattableUser?._id}`);
        }}
        style={{ cursor: "pointer" }}
      >
        <ChatUser key={idx} userCardProps={userCardProps} />
        <Divider />
      </div>
    );
  });
};

export default ChatUsers;
