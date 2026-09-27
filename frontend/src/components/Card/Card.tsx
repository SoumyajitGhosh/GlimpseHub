import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classNames from "classnames";

interface CardProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, style, children },
  ref
) {
  const cardClassNames = classNames({
    card: true,
    [className ?? ""]: className,
  });

  return (
    <div ref={ref} className={cardClassNames} style={style}>
      {children}
    </div>
  );
});

export default Card;
