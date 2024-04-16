import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import { Button } from "components/ui/Button";
import "styles/views/GameSetup.scss";
import PropTypes from "prop-types";

const GameSetup = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [showGameSettings, setShowGameSettings] = useState(false); // State to manage visibility of game settings
  const { state } = useLocation();
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("userId");

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
        <BaseContainer title="Game setup" className="gamesetup container">
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
        <GameSettings
          showGameSettings={showGameSettings}
          hideSettingsContainer={hideSettingsContainer}
        />
      )}
    </div>
  );
};

/**The following part is for adjusting the game parameters and could be a seperate component */

const GameSettings = ({ showGameSettings, hideSettingsContainer }) => {
  const [timerValue, setTimerValue] = useState(30); // standard timer set to 30

  const handleTimerChange = (event) => {
    setTimerValue(parseInt(event.target.value)); // converting to integer
  };

  return (
    <BaseContainer title="Game Settings" className="gamesetup container">
      <div className="gamesetup-row">
        <div className="gamesetup explanation">Guessing Time:</div>
        <select value={timerValue} onChange={handleTimerChange}>
          <option value={30}>30s</option>
          <option value={20}>20s</option>
          <option value={10}>10s</option>
        </select>
      </div>
      <br></br>
      <Button width="100%" onClick={hideSettingsContainer}>
        Cancel
      </Button>
      <br></br>
      <Button width="100%">Apply</Button>
    </BaseContainer>
  );
};

GameSettings.propTypes = {
  showGameSettings: PropTypes.bool.isRequired, // Validate prop type
  hideSettingsContainer: PropTypes.func.isRequired, // Validate prop type
};

export default GameSetup;
