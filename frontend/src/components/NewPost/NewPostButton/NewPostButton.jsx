import React, { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { showModal, hideModal } from "../../../redux/modal/modalActions";

import Icon from "../../Icon/Icon";

const NewPostButton = ({ showModal, hideModal, plusIcon, children, style }) => {
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    // Get the first selected file
    const file = event.target.files[0];
    if (!file) return;
    if (window.outerWidth > 600) {
      showModal(
        { file, hide: () => hideModal("NewPost/NewPost") },
        "NewPost/NewPost"
      );
    } else {
      navigate("/new", { state: { file } });
    }
    // Resetting the input value so you are able to
    // use the same file twice
    // fileInputRef.current.value = "";
  };

  return (
    <Fragment>
      <label
        style={{ cursor: "pointer", ...style }}
        className="icon"
        htmlFor="file-upload"
        aria-label={children ? undefined : "Create new post"}
      >
        {children ? (
          children
        ) : (
          <Icon icon={plusIcon ? "add-circle-outline" : "camera-outline"} />
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(NewPostButton);
