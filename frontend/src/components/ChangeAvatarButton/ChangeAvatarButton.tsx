import type { ChangeEvent, MouseEvent, ReactNode } from "react";
import { Fragment, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  changeAvatarStart,
  removeAvatarStart,
  selectCurrentUser,
  selectToken,
  selectError,
} from "../../redux/user/userSlice";
import { showModal } from "../../redux/modal/modalSlice";
import { showAlert } from "../../redux/alert/alertSlice";

interface ChangeAvatarButtonProps {
  children?: ReactNode;
}

const ChangeAvatarButton = ({ children }: ChangeAvatarButtonProps) => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectToken);
  const error = useAppSelector(selectError);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      dispatch(showAlert(error));
    }
  }, [error, dispatch]);

  const handleClick = (event: MouseEvent<HTMLLabelElement>) => {
    if (currentUser?.avatar) {
      event.preventDefault();
      dispatch(
        showModal(
          {
            options: [
              {
                text: "Upload Photo",
                className: "color-blue font-bold",
                onClick: () => {
                  inputRef.current?.click();
                },
              },
              {
                warning: true,
                text: "Remove Current Photo",
                onClick: () => {
                  changeAvatar(undefined, true);
                },
              },
            ],
          },
          "OptionsDialog/OptionsDialog"
        )
      );
    } else {
      inputRef.current?.click();
    }
  };

  const changeAvatar = async (
    event?: ChangeEvent<HTMLInputElement>,
    remove?: boolean
  ) => {
    if (remove) {
      await dispatch(removeAvatarStart(token ?? ""));
    } else {
      const file = event?.target.files?.[0];
      if (!file) return;
      await dispatch(changeAvatarStart(file, token ?? ""));
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
        aria-label="Upload profile photo"
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
