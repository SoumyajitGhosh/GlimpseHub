import React from 'react';
import classNames from 'classnames';

const Card = React.forwardRef(({ className, style, children }, ref) => {
  const cardClassNames = classNames({
    card: true,
    [className]: className,
  });

  return (
    <div ref={ref} className={cardClassNames} style={style}>
      {children}
    </div>
  );
});

export default Card;