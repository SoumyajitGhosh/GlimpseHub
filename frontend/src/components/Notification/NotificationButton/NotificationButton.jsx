import React, { useState, useEffect } from 'react';
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
      !showNotificationPopup && setShowNotificationPopup(true);
      setShowNotificationPopupTimeout(
        setTimeout(() => setShowNotificationPopup(false), 10000)
      );
    }
  }, [notificationState.unreadCount]);

  useEffect(() => {
    if (showNotifications) {
      clearTimeout(notificationPopupTimeout);
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

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <button className="notification-button">
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
      </button>
      {showNotifications && !mobile && (
        <PopupCard hide={() => setShowNotifications(false)} leftAlign>
          <NotificationFeed setShowNotifications={setShowNotifications} />
        </PopupCard>
      )}
    </div>
  );
};

export default NotificationButton;
