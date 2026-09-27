import type { CSSProperties, MouseEventHandler } from "react";
import classNames from "classnames";
import defaultAvatar from "../../assets/img/default-avatar.png";

interface AvatarProps {
  imageSrc?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  style?: CSSProperties;
}

const Avatar = ({
  imageSrc = defaultAvatar,
  className,
  onClick,
  style,
}: AvatarProps) => {
  const avatarClasses = classNames({
    avatar: true,
    [className ?? ""]: className,
  });

  return (
    <img
      className={avatarClasses}
      onClick={onClick}
      style={style}
      src={imageSrc}
      alt="Avatar"
    />
  );
};

export default Avatar;
