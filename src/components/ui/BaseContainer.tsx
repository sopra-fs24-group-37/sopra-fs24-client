import React from "react";
import "../../styles/ui/BaseContainer.scss";
import PropTypes from "prop-types";

const BaseContainer = (props) => (
  <div {...props} className={`base-container ${props.className ?? ""}`}>
    {props.title && <h2>{props.title}</h2>}
    {props.children}
  </div>
);

BaseContainer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default BaseContainer;
