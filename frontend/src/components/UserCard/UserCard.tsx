import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { useAppDispatch } from "../../redux/hooks";
import { hideModal } from "../../redux/modal/modalSlice";
import { formatDateDistance } from "../../utils/timeUtils";

import Avatar from "../Avatar/Avatar";

interface UserCardProps {
  avatar?: string;
  username: string;
  subText?: ReactNode;
  subTextDark?: boolean;
  date?: string | number | Date;
  style?: CSSProperties;
  onClick?: () => void;
  children?: ReactNode;
  avatarMedium?: boolean;
  linkTo?: string;
  /** Accepted for call-site convenience; not rendered directly. */
  userId?: string;
  following?: boolean;
}

const UserCard = ({
  avatar,
  username,
  subText,
  subTextDark,
  date,
  style,
  onClick,
  children,
  avatarMedium,
  linkTo = undefined,
}: UserCardProps) => {
  const dispatch = useAppDispatch();
  const avatarClassNames = classNames({
    "avatar--small": !avatarMedium,
    "avatar--medium": avatarMedium,
  });
  return (
    <div className="user-card" style={style}>
      {onClick ? (
        <Avatar
          onClick={() => onClick()}
          className={avatarClassNames}
          imageSrc={avatar}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <Link
          style={{ display: "flex" }}
          onClick={() => dispatch(hideModal("OptionsDialog"))}
          to={linkTo ? linkTo : `/${username}`}
        >
          <Avatar className={avatarClassNames} imageSrc={avatar} />
        </Link>
      )}
      <div className="user-card__details">
        {onClick ? (
          <p
            onClick={() => onClick()}
            style={{ cursor: "pointer" }}
            className="heading-4 font-bold"
          >
            {username}
          </p>
        ) : (
          <Link
            onClick={() => dispatch(hideModal("OptionsDialog"))}
            style={{ textDecoration: "none" }}
            to={linkTo ? linkTo : `/${username}`}
          >
            <p className="heading-4 font-bold">{username}</p>
          </Link>
        )}
        {subText && (
          <p
            className={`heading-4 ${
              subTextDark ? "color-black" : "color-grey"
            }`}
          >
            {subText}
            {date && (
              <span className="color-grey ml-sm">
                {formatDateDistance(date)}
              </span>
            )}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default UserCard;
