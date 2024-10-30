import React, { useEffect, memo, lazy, Suspense } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { hideModal } from "../../redux/modal/modalActions";

const Modal = memo(({ component, hideModal, ...additionalProps }) => {
  const modalRoot = document.querySelector("#modal-root");
  const el = document.createElement("div");
  el.className = "modal grid";

  // Dynamically import the component based on the `component` prop
  const Child = lazy(() => import(`../../components/${component}`));

  useEffect(() => {
    const hide = ({ target }) => {
      if (target === el || !el.contains(target)) {
        hideModal(component);
      }
    };
    el.addEventListener("mousedown", hide, false);
    modalRoot.appendChild(el);

    return () => {
      el.removeEventListener("mousedown", hide, false);
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot, hideModal, component]);

  return ReactDOM.createPortal(
    <Suspense fallback={<div>Loading...</div>}>
      <Child hide={() => hideModal(component)} {...additionalProps} />
    </Suspense>,
    el
  );
});

Modal.whyDidYouRender = true;

Modal.propTypes = {
  component: PropTypes.string.isRequired,
  props: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(Modal);
