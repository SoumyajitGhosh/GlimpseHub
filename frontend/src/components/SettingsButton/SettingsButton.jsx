import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showModal } from "../../redux/modal/modalSlice";
import { signOut } from "../../redux/user/userSlice";

import Icon from "../Icon/Icon";

const SettingsButton = ({ showModal, signOut }) => {
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

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  signOut: () => dispatch(signOut()),
});

export default connect(null, mapDispatchToProps)(SettingsButton);
