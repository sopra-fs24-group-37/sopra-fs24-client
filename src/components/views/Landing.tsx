import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Landing.scss";
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
    <div className="landing background">
      <BaseContainer className="flex-center-wrapper">
        <div className="landing field">
          <div className="landing container">
            <div className="landing form">
              <div className="landing title">
                Welcome to Swissquiz!
              </div>
              <div className="landing button-container">

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
              Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </div>
  );
};

export default Landing;
