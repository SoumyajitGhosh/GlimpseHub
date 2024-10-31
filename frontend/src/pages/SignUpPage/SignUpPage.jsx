import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSelectors";

import SignUpCard from "../../components/SignUpCard/SignUpCard";

const SignUpPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  return (
    <main className="sign-up-page">
      <SignUpCard />
    </main>
  );
};

export default SignUpPage;
