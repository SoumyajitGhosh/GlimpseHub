import React, { useState, memo, Fragment } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import useScrollPositionThrottled from "../../hooks/useScrollPositionThrottled";

import LogoCamera from "../../assets/svg/logo-camera.svg?react";
import SearchBox from "../SearchBox/SearchBox";
import NewPostButton from "../NewPost/NewPostButton/NewPostButton";
import NotificationButton from "../Notification/NotificationButton/NotificationButton";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

const Header = memo(() => {
  const [shouldMinimizeHeader, setShouldMinimizeHeader] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentUser = useSelector(selectCurrentUser);

  // Shrink header height and remove logo on scroll
  useScrollPositionThrottled(({ currentScrollPosition }) => {
    if (window.outerWidth > 600) {
      setShouldMinimizeHeader(currentScrollPosition > 100);
    }
  });

  const headerClassNames = classNames({
    header: true,
    "header--small": shouldMinimizeHeader,
  });

  return (
    <header className={headerClassNames}>
      <div className="header__content">
        <Link to="/" className="header__logo">
          <div className="header__logo-image">
            <LogoCamera />
          </div>
          <div className="header__logo-header">
            <h3 className="heading-logo">GlimpseHub</h3>
          </div>
        </Link>
        <SearchBox />
        <div className="header__icons">
          {currentUser ? (
            <Fragment>
              <Link to="/explore">
                <Icon
                  icon={pathname === "/explore" ? "compass" : "compass-outline"}
                />
              </Link>
              <NotificationButton />
              <Link to={`/direct/inbox`}>
                <Icon
                  icon={
                    pathname.includes(`direct`)
                      ? "chatbubble-ellipses"
                      : "chatbubble-ellipses-outline"
                  }
                />
              </Link>
              <Link to={`/${currentUser.username}`}>
                <Icon
                  icon={
                    pathname === `/${currentUser.username}`
                      ? "person-circle"
                      : "person-circle-outline"
                  }
                />
              </Link>
              <NewPostButton />
            </Fragment>
          ) : (
            <Fragment>
              <Link style={{ marginRight: "1rem" }} to="/login">
                <Button>Log In</Button>
              </Link>
              <Link to="/signup">
                <h3 className="heading-3 heading--button color-blue">
                  Sign Up
                </h3>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
