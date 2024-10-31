import React, { Fragment, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import {
    changeAvatarStart,
    removeAvatarStart,
} from '../../redux/user/userActions';
import {
  selectCurrentUser,
  selectToken,
  selectError,
} from "../../redux/user/userSelectors";
import { showModal } from '../../redux/modal/modalActions';
import { showAlert } from '../../redux/alert/alertActions';

const ChangeAvatarButton = ({ children }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const error = useSelector(selectError);

  const inputRef = useRef();

  useEffect(() => {
    if (error) {
      dispatch(showAlert(error));
    }
  }, [error, dispatch]);

  const handleClick = (event) => {
    if (currentUser.avatar) {
      event.preventDefault();
      return dispatch(
        showModal(
          {
            options: [
              {
                text: "Upload Photo",
                className: "color-blue font-bold",
                onClick: () => {
                  inputRef.current.click();
                },
              },
              {
                warning: true,
                text: "Remove Current Photo",
                onClick: () => {
                  changeAvatar(null, true);
                },
              },
            ],
          },
          "OptionsDialog/OptionsDialog"
        )
      );
    }
    inputRef.current.click();
  };

  const changeAvatar = async (event, remove) => {
    if (remove) {
      await dispatch(removeAvatarStart(token));
    } else {
      await dispatch(changeAvatarStart(event.target.files[0], token));
    }
    if (!error) dispatch(showAlert("Profile picture updated."));
  };

  return (
    <Fragment>
      <label
        className="color-blue font-bold heading-4"
        style={{ cursor: "pointer", position: "relative" }}
        onClick={handleClick}
      >
        {children || "Change Profile Photo"}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={(event) => changeAvatar(event)}
      />
    </Fragment>
  );
};

export default ChangeAvatarButton;
