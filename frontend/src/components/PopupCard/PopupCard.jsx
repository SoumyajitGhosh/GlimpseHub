import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Card from "../Card/Card";

const PopupCard = ({ children, hide, leftAlign }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    // Close popup when clicking outside of it
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        hide();
      }
    };

    // Add event listener to detect outside clicks
    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [hide]);

  return (
    <Card
      ref={popupRef}
      className={classNames({
        "popup-card": true,
        "popup-card--left-align": leftAlign,
      })}
    >
      <ul
        style={{
          listStyleType: "none",
          maxHeight: "30rem",
          overflowY: "auto",
          backgroundColor: "white",
        }}
        // Prevent hiding the component when clicking inside the component
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </ul>
    </Card>
  );
};

export default PopupCard;
