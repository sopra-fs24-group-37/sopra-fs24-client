// Login.js
import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Alert from "components/ui/Alert"; // Import the Alert component
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

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [errorMessage, setErrorMessage] = useState<string>(null); // State to handle error message

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/login", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("userId", user.userId);

      // Login successfully worked --> navigate to the route /lobby in the LobbyRouter
      navigate("/lobby");
    } catch (error) {
      setErrorMessage(`Something went wrong during the login: ${handleError(error)}`);
    }
  };

  const goToRegistration = () => {
    navigate("/registration");
  };

  const handleCloseAlert = () => {
    setErrorMessage(null);
  };

  return (
    <BaseContainer className="flex-center-wrapper">
      <div className="login container">
        <div className="login form">
          <div className="login explanation">
            Please login with your username and password
          </div>
          <br></br>
          <br></br>
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%" // controls size of login button
              onClick={() => doLogin()}
            >
              Login
            </Button>
            <Button
              width="100%" // controls size of register button
              onClick={goToRegistration}
            >
              Go to Registration
            </Button>
          </div>
        </div>
      </div>
      {errorMessage && <Alert message={errorMessage} onClose={handleCloseAlert} />} {/* Render alert independently */}
    </BaseContainer>
  );
};

export default Login;
