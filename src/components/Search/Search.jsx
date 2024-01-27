/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Search = ({
  className,
  overlapGroupClassName,
  unionClassName,
  union = "https://c.animaapp.com/yGFj865V/img/union-2.svg",
  ellipseClassName,
  ellipseClassNameOverride,
  ellipse = "https://c.animaapp.com/yGFj865V/img/ellipse-54-2.svg",
}) => {
  return (
    <div className={`search ${className}`}>
      <div className={`overlap-group ${overlapGroupClassName}`}>
        <img className={`union ${unionClassName}`} alt="Union" src={union} />
        <div className={`ellipse ${ellipseClassName}`} />
        <img className={`img ${ellipseClassNameOverride}`} alt="Ellipse" src={ellipse} />
      </div>
    </div>
  );
};

Search.propTypes = {
  union: PropTypes.string,
  ellipse: PropTypes.string,
};
