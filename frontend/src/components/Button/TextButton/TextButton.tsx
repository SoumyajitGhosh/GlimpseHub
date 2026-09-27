import type { ButtonHTMLAttributes, ReactNode } from "react";
import ClassNames from "classnames";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  blue?: boolean;
  darkBlue?: boolean;
  bold?: boolean;
  large?: boolean;
  medium?: boolean;
  small?: boolean;
}

const TextButton = ({
  children,
  blue,
  darkBlue,
  bold,
  large,
  medium,
  small,
  ...additionalProps
}: TextButtonProps) => {
  const textButtonClassNames = ClassNames({
    "text-button": true,
    "heading-3": large,
    "heading-4": medium,
    "heading-5": small,
    "color-blue": blue,
    "color-blue-2": darkBlue,
    "font-bold": bold,
  });
  return (
    <button {...additionalProps} className={textButtonClassNames}>
      {children}
    </button>
  );
};

export default TextButton;
