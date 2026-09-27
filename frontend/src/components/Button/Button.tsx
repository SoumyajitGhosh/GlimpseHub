import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import classNames from "classnames";

import Loader from "../Loader/Loader";

interface ButtonProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  inverted?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  onClick,
  inverted,
  style,
  disabled,
  loading,
}: ButtonProps) => {
  const buttonClasses = classNames({
    button: true,
    "button--inverted": inverted,
    "button--disabled": disabled,
  });
  return (
    <button
      style={style}
      className={buttonClasses}
      onClick={loading ? () => {} : onClick}
      type={disabled ? "button" : "submit"}
    >
      {loading && <Loader />}
      {children}
    </button>
  );
};

export default Button;
