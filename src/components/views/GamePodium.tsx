import React from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/GamePodium.scss";

const GamePodium = () => {
  const navigate = useNavigate(); // Get the navigate function from useNavigate

  const goToLobby = () => {
    navigate("/lobby"); // Navigate to the "/lobby" route
  };

  return (
    <div className="flex-center-wrapper">
      <BaseContainer title="Podium view" className="gamepodium container">
        <br />
        <Button width="100%" onClick={goToLobby}>
          Go back to Lobby
        </Button>
      </BaseContainer>
    </div>
  );
};

export default GamePodium;
