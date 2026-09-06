import { Fragment } from "react";
import PropTypes from "prop-types";
import { useTransition, animated } from "@react-spring/web";

import Icon from "../Icon";

const PulsatingIcon = ({
  toggle,
  constantProps = {},
  toggledProps,
  elementRef,
}) => {
  const transitions = useTransition(toggle, {
    from: { transform: "scale(1.3)" },
    enter: { transform: "scale(1)" },
    leave: { display: "none" },
    config: {
      mass: 1,
      tension: 500,
      friction: 20,
    },
    // Prevent animating on initial render. elementRef is owned by the parent
    // and its attachment state is intentionally re-read on every render so the
    // very next transition after mount is no longer skipped.
    // eslint-disable-next-line react-hooks/refs -- deliberate read of a foreign ref, not this component's own render output
    immediate: !elementRef.current,
  });

  return (
    <Fragment>
      {transitions((props, item, { key }) =>
        item ? (
          <animated.div key={`${key}-on`} style={props}>
            <Icon {...constantProps} {...toggledProps[0]} />
          </animated.div>
        ) : (
          <animated.div key={`${key}-off`} style={props}>
            <Icon {...constantProps} {...toggledProps[1]} />
          </animated.div>
        )
      )}
    </Fragment>
  );
};

PulsatingIcon.propTypes = {
  toggle: PropTypes.bool.isRequired,
  constantProps: PropTypes.object,
  toggledProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  elementRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
};

export default PulsatingIcon;
