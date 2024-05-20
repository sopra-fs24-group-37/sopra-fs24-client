import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import "styles/ui/ConfirmLeave.scss"; // Import the styles
import BaseContainer from "components/ui/BaseContainer";

const ConfirmLeave = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirm-leave overlay">
      <BaseContainer className="confirm-leave.container">
        <p className="title">Are you sure you want to leave?</p>
        <div className="button-container">
          <Button onClick={onConfirm} className="button" variant="primary">
            Leave
          </Button>
          <Button onClick={onCancel} className="button" variant="secondary">
            Stay
          </Button>
        </div>
      </BaseContainer>
    </div>
  );
};

ConfirmLeave.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmLeave;
