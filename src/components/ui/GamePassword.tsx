import React, { useState } from "react";
import { Button } from "components/ui/Button";
import "styles/ui/GamePassword.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  const inputType =
    props.label.toLowerCase() === "password" ? "password" : "text";

  return (
    <div className="game-password field">
      <label className="game-password label">{props.label}</label>
      <input
        type={inputType}
        className="game-password input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const GamePassword = ({ onSubmit, onCancel }) => {
  const [password, setPassword] = useState("");

  const handleChange = (input) => {
    // Allow only numbers and limit to 6 characters
    const numericInput = input.replace(/\D/g, "").slice(0, 6);
    setPassword(numericInput);
  };

  const handleSubmit = () => {
    onSubmit(password);
  };

  const isSubmitDisabled = password.length !== 6; // Check if password length is not 6

  return (
    <div className="game-password overlay">
      <BaseContainer className="game-password container">
        <div className="game-password form">
          <div className="game-password explanation">Password required.</div>
          <br></br>
          <FormField
            label="PIN:"
            value={password}
            onChange={(pw) => handleChange(pw)}
          />
          <div className="game-password button-container">
            <Button
              disabled={isSubmitDisabled}
              width="100%"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button width="100%" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </BaseContainer>
    </div>
  );
};

GamePassword.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default GamePassword;
