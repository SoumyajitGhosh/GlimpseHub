import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

import { selectCurrentUser } from "../../redux/user/userSlice";

import SignUpCard from "../../components/SignUpCard/SignUpCard";

const SignUpPage = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

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
