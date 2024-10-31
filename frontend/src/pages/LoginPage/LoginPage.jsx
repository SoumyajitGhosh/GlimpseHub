import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

// import { githubSignInStart } from "../../redux/user/userActions";
import { selectCurrentUser } from "../../redux/user/userSelectors";

import LoginCard from "../../components/LoginCard/LoginCard";

const LoginPage = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const currentUser = useSelector(selectCurrentUser);

  if (currentUser) navigate("/");

  const params = new URLSearchParams(search);
  // const code = params.get("code");
  // const authState = params.get("state");

  // useEffect(() => {
  //   if (code) {
  //     if (authState !== sessionStorage.getItem("authState")) {
  //       return console.warn("Auth state does not match.");
  //     }
  //     dispatch(githubSignInStart(code));
  //   }
  // }, [authState, code, dispatch]);

  return (
    <main data-test="page-login" className="login-page">
      <div className="login-page__showcase"></div>
      <LoginCard />
    </main>
  );
};

LoginPage.propTypes = {
  currentUser: PropTypes.object,
};

export default LoginPage;
