import type { ReactNode } from "react";
import { animated } from "@react-spring/web";

import TextButton from "../Button/TextButton/TextButton";
import type { AnimatedStyle } from "../../types";

interface AlertProps {
  children?: ReactNode;
  onClick?: (() => void) | null;
  style?: AnimatedStyle;
}

const Alert = ({ children, onClick, style }: AlertProps) => {
  return (
    <animated.div style={style} className="alert">
      <h3 style={{ color: "white" }} className="heading-3 font-medium">
        {children}
      </h3>
      {onClick && (
        <TextButton onClick={onClick} blue bold>
          Retry
        </TextButton>
      )}
    </animated.div>
  );
};

export default Alert;
