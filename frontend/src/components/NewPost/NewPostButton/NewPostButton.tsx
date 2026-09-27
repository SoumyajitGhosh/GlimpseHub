import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { showModal, hideModal } from "../../../redux/modal/modalSlice";
import type { AppDispatch } from "../../../redux/store";

import Icon from "../../Icon/Icon";

interface NewPostButtonOwnProps {
  plusIcon?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

interface NewPostButtonProps extends NewPostButtonOwnProps {
  showModal: (props: Record<string, unknown>, component: string) => void;
  hideModal: (component: string) => void;
}

const NewPostButton = ({
  showModal,
  hideModal,
  plusIcon,
  children,
  style,
}: NewPostButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Get the first selected file
    const file = event.target.files?.[0];
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
        aria-label="Choose a photo to post"
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  showModal: (props: Record<string, unknown>, component: string) =>
    dispatch(showModal(props, component)),
  hideModal: (component: string) => dispatch(hideModal(component)),
});

export default connect<
  Record<string, never>,
  ReturnType<typeof mapDispatchToProps>,
  NewPostButtonOwnProps
>(
  null,
  mapDispatchToProps
)(NewPostButton);
