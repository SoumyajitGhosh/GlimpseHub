import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectCurrentUser } from "../../../redux/user/userSelectors";

import Icon from "../../Icon/Icon";
import Button from "../../Button/Button";
import TextButton from "../../Button/TextButton/TextButton";

const MobileHeader = ({ children, backArrow, style, show }) => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  return (
    <header
      style={{ ...style, display: `${show ? "grid" : "none"}` }}
      className="header--mobile"
    >
      {currentUser ? (
        <Fragment>
          {backArrow && (
            <Icon
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
              icon="chevron-back"
            />
          )}
          {children}
        </Fragment>
      ) : (
        <Fragment>
          <h3 style={{ fontSize: "2.5rem" }} className="heading-logo">
            GlimpseHub
          </h3>
          <div style={{ gridColumn: "-1" }}>
            <Button
              onClick={() => navigate("/")}
              style={{ marginRight: "1rem" }}
            >
              Log In
            </Button>
            <TextButton onClick={() => navigate("/signup")} bold blue>
              Sign Up
            </TextButton>
          </div>
        </Fragment>
      )}
    </header>
  );
};

export default MobileHeader;
