import type { ReactNode } from "react";

interface DividerProps {
  children?: ReactNode;
}

const Divider = ({ children }: DividerProps) => (
  <h4
    className={`heading-4 color-grey ${
      children ? "divider--split" : "divider"
    }`}
  >
    {children}
  </h4>
);

export default Divider;
