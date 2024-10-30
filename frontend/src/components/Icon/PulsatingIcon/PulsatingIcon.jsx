import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from "react-spring";

import Icon from '../Icon';

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
    // Prevent animating on initial render
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
