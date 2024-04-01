import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const Landing = () => {
  return (
    <BaseContainer>
      <Header height="100px" /> 
      <div className="login field">
        <div className="login container">
      Please login as an existing user or register as a new user.
        </div>
      </div>
      <div className="login container">
        <Link to="/login">
          <Button>Login</Button>
        </Link>
        <br />
        <Link to="/registration">
          <Button>Register</Button>
        </Link>
      </div>
    </BaseContainer>
  );
};

export default Landing;
