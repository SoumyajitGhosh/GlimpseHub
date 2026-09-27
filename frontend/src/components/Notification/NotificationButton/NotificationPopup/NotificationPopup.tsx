import { animated } from "@react-spring/web";

import Icon from "../../../Icon/Icon";
import type { AnimatedStyle, Notification } from "../../../../types";

interface NotificationPopupProps {
  style: AnimatedStyle;
  notifications: Notification[];
}

const NotificationPopup = ({ style, notifications }: NotificationPopupProps) => {
  let newFollowers = 0;
  let newLikes = 0;
  let newComments = 0;

  notifications.forEach((notification) => {
    if (!notification.read) {
      switch (notification.notificationType) {
        case "follow": {
          newFollowers += 1;
          break;
        }
        case "comment":
        case "mention": {
          newComments += 1;
          break;
        }
        default: {
          newLikes += 1;
        }
      }
    }
  });

  const renderIcons = (icon: string, number: number) => (
    <div>
      <Icon className="icon--small" icon={icon} />
      <span>{number}</span>
    </div>
  );

  return (
    <animated.div className="notification-button__popup" style={style}>
      {newFollowers > 0 && renderIcons("person", newFollowers)}
      {newLikes > 0 && renderIcons("heart", newLikes)}
      {newComments > 0 && renderIcons("chatbubble", newComments)}
    </animated.div>
  );
};

export default NotificationPopup;
