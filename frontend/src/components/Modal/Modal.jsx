import React, { useEffect, memo, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { hideModal } from "../../redux/modal/modalActions";

const Modal = memo(({ component, ...additionalProps }) => {
  const dispatch = useDispatch();
  const modalRoot = document.querySelector("#modal-root");
  const el = document.createElement("div");
  el.className = "modal grid";

  // Dynamically import the component based on the `component` prop
  const Child = lazy(() => import(`../../components/${component}`));

  useEffect(() => {
    const hide = ({ target }) => {
      if (target === el || !el.contains(target)) {
        dispatch(hideModal(component));
      }
    };
    el.addEventListener("mousedown", hide, false);
    modalRoot.appendChild(el);

    return () => {
      el.removeEventListener("mousedown", hide, false);
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot, dispatch, component]);

  return ReactDOM.createPortal(
    <Suspense fallback={<div>Loading...</div>}>
      <Child hide={() => dispatch(hideModal(component))} {...additionalProps} />
    </Suspense>,
    el
  );
});

Modal.whyDidYouRender = true;

Modal.propTypes = {
  component: PropTypes.string.isRequired,
  props: PropTypes.object,
};

export default Modal;
