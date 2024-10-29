import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useNavigate } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import SignUpCard from "../../components/SignUpCard/SignUpCard";

const SignUpPage = ({ currentUser }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);
  return (
    <main className="sign-up-page">
      <SignUpCard />
    </main>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(SignUpPage);
