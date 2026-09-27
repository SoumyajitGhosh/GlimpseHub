import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showModal } from "../../redux/modal/modalSlice";
import { signOut } from "../../redux/user/userSlice";
import type { AppDispatch } from "../../redux/store";

import Icon from "../Icon/Icon";

interface SettingsButtonProps {
  showModal: (props: Record<string, unknown>, component: string) => void;
  signOut: () => void;
}

const SettingsButton = ({ showModal, signOut }: SettingsButtonProps) => {
  const navigate = useNavigate();
  return (
    <Icon
      icon="aperture-outline"
      style={{ cursor: "pointer" }}
      onClick={() => {
        showModal(
          {
            options: [
              {
                text: "Change Password",
                onClick: () => navigate("/settings/password"),
              },
              {
                text: "Log Out",
                onClick: () => {
                  signOut();
                  navigate("/");
                },
              },
            ],
          },
          "OptionsDialog/OptionsDialog"
        );
      }}
    />
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  showModal: (props: Record<string, unknown>, component: string) =>
    dispatch(showModal(props, component)),
  signOut: () => dispatch(signOut()),
});

export default connect<
  Record<string, never>,
  ReturnType<typeof mapDispatchToProps>,
  Record<string, never>
>(
  null,
  mapDispatchToProps
)(SettingsButton);
