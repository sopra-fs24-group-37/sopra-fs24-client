import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Alert from "components/ui/Alert"; // Import the new Alert component
import PropTypes from "prop-types";

const FormField = (props) => {
  const inputType =
    props.label.toLowerCase() === "password" ? "password" : "text";

  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={inputType}
        className="login input"
        placeholder="enter here.."
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

const Registration = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>(null); // State to handle error message

  const handleUsernameChange = (input) => {
    const limitedInput = input.slice(0, 15);
    setUsername(limitedInput);
  };

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);

      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("userId", user.userId);
      sessionStorage.setItem("username", user.username);

      navigate("/lobby");
    } catch (error) {
      setErrorMessage(
        `Something went wrong during the registration: ${handleError(error)}`
      );
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const handleCloseAlert = () => {
    setErrorMessage(null);
  };

  return (
    <BaseContainer className="flex-center-wrapper">
      <div className="login container">
        <div className="login form">
          <div className="login explanation">Please register as a new user</div>
          <br></br>
          <br></br>
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => handleUsernameChange(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%" // controls size of register button
              onClick={() => doRegistration()}
            >
              Register
            </Button>
            <Button
              width="100%" // controls size of register button
              onClick={goToLogin}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
      {errorMessage && (
        <Alert message={errorMessage} onClose={handleCloseAlert} />
      )}{" "}
      {/* Render alert independently */}
    </BaseContainer>
  );
};

export default Registration;
