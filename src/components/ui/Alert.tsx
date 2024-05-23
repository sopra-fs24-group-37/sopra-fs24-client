import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import "styles/ui/Alert.scss"; // Make sure the path is correct
import BaseContainer from "components/ui/BaseContainer";

const Alert = ({ message, onClose }) => {
  return (
    <div className="alert overlay">
      <BaseContainer className="alert base-container">
        <p className="title">Error</p>
        <p className="message">{message}</p>
        <div className="button-container">
          <Button onClick={onClose} className="button" variant="primary">
            Ok
          </Button>
        </div>
      </BaseContainer>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Alert;
