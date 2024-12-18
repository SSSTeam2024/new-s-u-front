import React from "react";
import "./style.css";

const CustomLoaderForButton = () => {
  return (
    <React.Fragment>
      <div className="loader-button-container">
        <div className="button-loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CustomLoaderForButton;
