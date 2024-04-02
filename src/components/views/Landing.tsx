import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";

const Landing = () => {

const navigate = useNavigate();

const goToLogin = () => {
  navigate("/login");
};

const goToRegistration = () => {
  navigate("/registration");
};

  return (
    <BaseContainer>
      <div className="login field">
        <div className="login container">
          <div className="login form">
            <div className="login button-container">

            <Button
              width="100%" // controls size of login button
              onClick={goToLogin}
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
      </div>
    </BaseContainer>
  );
};

export default Landing;
