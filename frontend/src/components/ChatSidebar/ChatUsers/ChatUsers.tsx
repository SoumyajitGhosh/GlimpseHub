import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserCard from "../../UserCard/UserCard";
import Divider from "../../Divider/Divider";
import type { ChatUser as ChatUserType } from "../../../types";

interface ChatUsersProps {
  chattableUsers?: ChatUserType[] | null;
}

interface ChatUserCardProps {
  username: string;
  subTextDark?: boolean;
  avatar?: string;
  style?: CSSProperties;
  subText?: string;
  linkTo: string;
}

const ChatUsers = ({ chattableUsers }: ChatUsersProps) => {
  const navigate = useNavigate();

  const ChatUserBody = ({ userCardProps }: { userCardProps: ChatUserCardProps }) => {
    return (
      <Fragment>
        <Link to={userCardProps.linkTo}>
          <img
            src={"S"}
            alt=""
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
  const ChatUser = ({ userCardProps }: { userCardProps: ChatUserCardProps }) => {
    // Pre-existing (predates the TS migration, see the pre-TS .jsx): this passes
    // the ChatUserBody *component reference* as children instead of invoking it
    // (`<ChatUserBody userCardProps={userCardProps} />`), so it has never
    // actually rendered — React silently drops a function child. Left as-is;
    // fixing it would newly render the `src={"S"}` placeholder image bug noted
    // in SETUP_NOTES, which is explicitly out of scope for this pass.
    return (
      <UserCard {...userCardProps}>{ChatUserBody as unknown as ReactNode}</UserCard>
    );
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
        key={chattableUser?._id ?? idx}
        onClick={() => {
          navigate(`/direct/${chattableUser?._id}`);
        }}
        className="chat-user"
      >
        <ChatUser userCardProps={userCardProps} />
        <Divider />
      </div>
    );
  });
};

export default ChatUsers;
