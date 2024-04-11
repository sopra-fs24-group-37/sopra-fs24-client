import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {

  const inputType = props.label.toLowerCase() === "password" ? "password" : "text";

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
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users/login", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /lobby in the LobbyRouter
      navigate("/lobby");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  const goToRegistration = () => {
    navigate("/registration");
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
            value={name}
            onChange={(n) => setName(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !name}
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
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
