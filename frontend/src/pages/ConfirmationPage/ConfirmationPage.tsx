import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";

import { showModal } from "../../redux/modal/modalSlice";
import { selectToken } from "../../redux/user/userSlice";

import { confirmUser } from "../../services/userService";

import Loader from "../../components/Loader/Loader";

const VerificationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const authToken = useAppSelector(selectToken);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }
    (async function () {
      let children = null;
      try {
        await confirmUser(authToken, token ?? "");
        children = (
          <h3 style={{ padding: "2rem" }} className="heading-3">
            Successfully confirmed your email.
          </h3>
        );
      } catch {
        children = (
          <h3 style={{ padding: "2rem" }} className="heading-3">
            Invalid or expired confirmation link.
          </h3>
        );
      }
      dispatch(
        showModal(
          {
            options: [],
            title: "Confirmation",
            cancelButton: false,
            children,
          },
          "OptionsDialog/OptionsDialog"
        )
      );
      return navigate("/");
    })();
  }, [authToken, navigate, dispatch, token]);

  return (
    <main className="verification-page">
      <Loader />
    </main>
  );
};

export default VerificationPage;
