import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Landing.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Howl } from "howler";
import IntroSound from "../../sounds/Intro.mp3"; // Import the sound file

const Landing = () => {
  const navigate = useNavigate();

  const playSound = () => {
    const sound = new Howl({
      src: [IntroSound],
      autoplay: true,
      loop: false,
      volume: 1.0,
    });
  };

  const goToLogin = () => {
    playSound(); // Play sound when the user clicks on the login button
    navigate("/login");
  };

  const goToRegistration = () => {
    playSound(); // Play sound when the user clicks on the register button
    navigate("/registration");
  };

  return (
    <div className="landing background">
      <BaseContainer className="flex-center-wrapper">
        <div className="landing field">
          <div className="landing container">
            <div className="landing form">
              <div className="landing title">Welcome to Swissquiz!</div>
              <div className="landing button-container">
                <Button width="100%" onClick={goToLogin}>
                  Login
                </Button>
                <Button width="100%" onClick={goToRegistration}>
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