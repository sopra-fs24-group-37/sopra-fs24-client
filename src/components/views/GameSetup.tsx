import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import { Button } from "components/ui/Button";
import "styles/views/GameSetup.scss";

const GameSetup = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [showGameSettings, setShowGameSettings] = useState(false); // State to manage visibility of game settings
  const { state } = useLocation();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userId");

  const isGamemaster = state?.gameMasterId === currentUser;

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/game/players");
      setPlayers(response.data);
    } catch (error) {
      console.error(`Could not fetch players: ${handleError(error)}`);
    }
  };

  const startGame = () => {
    console.log("Game is starting...");
  };

  const showSettingsContainer = () => {
    setShowGameSettings(true);
  };

  const hideSettingsContainer = () => {
    setShowGameSettings(false);
  };

  return (
    <div className="flex-center-wrapper">
      {!showGameSettings && (
        <BaseContainer title="Game setup" className="game container">
          <div>Waiting for other players to join...</div>
          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.username}</li>
            ))}
          </ul>
          {
            /**isGamemaster && */ <Button
              width="100%"
              onClick={showSettingsContainer}
            >
              Game Settings
            </Button>
          }
          <br></br>
          {isGamemaster && players.length > 1 && (
            <Button
              width="100%"
              onClick={startGame}
              disabled={players.length <= 1}
            >
              Start Game
            </Button>
          )}
          <Button width="100%" onClick={() => navigate("/lobby")}>
            Back to Lobby
          </Button>
        </BaseContainer>
      )}

      {showGameSettings && (
        <BaseContainer title="Game Settings" className="game container">
          <Button width="100%" onClick={hideSettingsContainer}>
            Cancel
          </Button>
        </BaseContainer>
      )}
    </div>
  );
};

export default GameSetup;
