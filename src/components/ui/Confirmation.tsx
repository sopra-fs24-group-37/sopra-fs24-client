import React from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import "../../styles/ui/ConfirmationModal.scss";

export const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="message">{message}</div>
      <div className="button-container">
        <Button onClick={onConfirm}>Leave</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
