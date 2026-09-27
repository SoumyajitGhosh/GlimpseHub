import type { MouseEventHandler } from "react";
import classNames from "classnames";
import { animated } from "@react-spring/web";

import type { AnimatedStyle } from "../../types";

interface IconProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  icon?: string;
  style?: AnimatedStyle;
}

const Icon = ({ onClick, className, icon, style }: IconProps) => {
  const iconClassNames = classNames({
    icon: true,
    [className ?? ""]: className,
  });

  return (
    <animated.div style={style} onClick={onClick} className={iconClassNames}>
      <ion-icon size="small" name={icon}></ion-icon>
    </animated.div>
  );
};

export default Icon;
