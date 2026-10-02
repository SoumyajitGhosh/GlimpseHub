import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

// import { githubSignInStart } from "../../redux/user/userSlice";
import { selectCurrentUser } from "../../redux/user/userSlice";

import LoginCard from "../../components/LoginCard/LoginCard";

const LoginPage = () => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  if (currentUser) navigate("/");

  // const { search } = useLocation();
  // const params = new URLSearchParams(search);
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

export default LoginPage;
