import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
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

  return chattableUsers?.map((chattableUser, idx) => {
    const userCardProps: ChatUserCardProps = {
      username: chattableUser?.username ?? "",
      subTextDark: true,
      avatar: chattableUser?.avatar,
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
        <UserCard {...userCardProps} />
        <Divider />
      </div>
    );
  });
};

export default ChatUsers;
