import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { showModal } from "../../redux/modal/modalActions";
import { selectToken } from "../../redux/user/userSelectors";

import { confirmUser } from "../../services/userService";

import Loader from "../../components/Loader/Loader";

const VerificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const authToken = useSelector(selectToken);

  useEffect(() => {
    if (!authToken) {
      return navigate("/");
    }
    (async function () {
      let children = null;
      try {
        await confirmUser(authToken, token);
        children = (
          <h3 style={{ padding: "2rem" }} className="heading-3">
            Successfully confirmed your email.
          </h3>
        );
      } catch (err) {
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
