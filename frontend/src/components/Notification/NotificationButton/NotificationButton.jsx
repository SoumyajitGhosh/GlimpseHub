import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useTransition } from 'react-spring';

import {
    selectNotifications,
    selectNotificationState,
} from '../../../redux/notification/notificationSelectors';

import Icon from '../../Icon/Icon';
import NotificationPopup from './NotificationPopup/NotificationPopup';
import PopupCard from '../../PopupCard/PopupCard';
import NotificationFeed from '../NotificationFeed/NotificationFeed';

const NotificationButton = ({ mobile, icon }) => {
  const notifications = useSelector(selectNotifications);
  const notificationState = useSelector(selectNotificationState);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationPopupTimeout, setShowNotificationPopupTimeout] =
    useState(null);

  useEffect(() => {
    if (notificationPopupTimeout) {
      clearTimeout(notificationPopupTimeout);
    }
    if (notificationState.unreadCount > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-shows the popup in response to unreadCount changing, paired with the timer below
      !showNotificationPopup && setShowNotificationPopup(true);
      setShowNotificationPopupTimeout(
        setTimeout(() => setShowNotificationPopup(false), 10000)
      );
    }
    // Stateful timer choreography — re-running on `notificationPopupTimeout` /
    // `showNotificationPopup` would reset the 10s auto-hide on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationState.unreadCount]);

  useEffect(() => {
    if (showNotifications) {
      clearTimeout(notificationPopupTimeout);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- dismisses the popup as soon as the notification feed is opened
      setShowNotificationPopup(false);
    }
  }, [showNotifications, notificationPopupTimeout]);

  const transitions = useTransition(
    notificationState.unreadCount > 0 && showNotificationPopup
      ? { notifications }
      : false,
    {
      from: { transform: "scale(0) translateX(-50%)", opacity: 0 },
      enter: { transform: "scale(1) translateX(-50%)", opacity: 1 },
      leave: { transform: "scale(0) translateX(-50%)", opacity: 0 },
      config: { tension: 280, friction: 20 },
    }
  );

  // On mobile this sits inside a <Link> that already handles navigation and
  // accessible naming, so it must render as non-interactive markup — a
  // nested <button> would be invalid HTML and confuse assistive tech.
  const Wrapper = mobile ? "span" : "button";
  const wrapperProps = mobile
    ? { className: "notification-button" }
    : { className: "notification-button", type: "button", "aria-label": "Notifications" };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Wrapper {...wrapperProps}>
        <Icon
          icon={icon || (showNotifications ? "heart" : "heart-outline")}
          className={notificationState.unreadCount > 0 ? "icon--unread" : ""}
          onClick={() => !mobile && setShowNotifications((prev) => !prev)}
          style={{ cursor: "pointer" }}
        />
        {transitions((style, item) =>
          item ? (
            <NotificationPopup
              style={style}
              notifications={item.notifications}
            />
          ) : null
        )}
      </Wrapper>
      {showNotifications && !mobile && (
        <PopupCard hide={() => setShowNotifications(false)} leftAlign>
          <NotificationFeed setShowNotifications={setShowNotifications} />
        </PopupCard>
      )}
    </div>
  );
};

export default NotificationButton;
