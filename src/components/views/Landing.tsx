import React from "react";
import { Link } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import Header from "./Header";

const Landing = () => {
  return (
    <BaseContainer>
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
