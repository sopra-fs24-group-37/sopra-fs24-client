import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import { Button } from "components/ui/Button";
import "styles/views/GameSetup.scss";
import PropTypes from "prop-types";

const GameSetup = ({ client }) => {
  const [players, setPlayers] = useState<User[]>([]);
  const [showGameSettings, setShowGameSettings] = useState(false); // State to manage visibility of game settings
  const { state } = useLocation();
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("userId");
  const gameId = sessionStorage.getItem("gameId");
  const [users, setUsers] = useState<User[]>(null);
  const [isGamemaster, setIsGamemaster] = useState(false);

  useEffect(() => {
    const updateSubscription = client.subscribe(
      "/topic/games/" + gameId,
      (message) => {
        console.log(`Received: ${message.body}`);
        const gameData = JSON.parse(message.body);
        const updatedUsers = gameData.players.map((player) => ({
          username: player.user.username,
        }));
        setUsers(updatedUsers);
        setIsGamemaster(gameData.gameMaster === parseInt(currentUser));
      }
    );
    const startSubscription = client.subscribe(
      "/topic/games/" + gameId + "/started",
      (message) => {
        console.log(`Received: ${message.body}`);
        console.log("random");
        navigate("/gameround/" + gameId);
      }
    );
    client.publish({
      destination: "/app/games/" + gameId + "/joined",
      body: gameId,
    });
  }, []);

  const startGame = async () => {
    try {
      const response = await api.put(`/games/${gameId}/start`);
      client.publish({
        destination: "/app/games/" + gameId + "/started",
        body: gameId,
      });
      if (response.status === 200) {
        // Game started successfully
        navigate("/gameround/" + gameId);
      } else {
        // Handle other HTTP status codes if needed
        console.error(`Starting game failed with status: ${response.status}`);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error(`Starting game failed: ${handleError(error)}`);
    }
  };

  const leaveGame = async () => {
    const confirmLeave = window.confirm("Do you want to leave this Lobby?");
    if (confirmLeave) {
      try {
        const currentUserId = sessionStorage.getItem("userId");
        const response = await api.put(`/games/${gameId}/leave`, currentUserId);
        if (response.status === 200) {
          client.publish({
            destination: "/app/games/" + gameId + "/joined",
            body: gameId,
          });
          sessionStorage.removeItem("gameId");
          navigate("/lobby");
        } else {
          console.error(`Leaving game failed with status: ${response.status}`);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error(`Leaving game failed: ${handleError(error)}`);
      }
    }
  };

  const showSettingsContainer = () => {
    setShowGameSettings(true);
  };

  const hideSettingsContainer = () => {
    setShowGameSettings(false);
  };

  let usersContent = <div>Waiting for other players to join...</div>;
  if (users) {
    usersContent = (
      <ul className="gamesetup user-list">
        {users.map((user, index) => (
          <div className="gamesetup user-container" key={index}>
            <li>{user.username}</li>
          </div>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex-center-wrapper">
      {!showGameSettings && (
        <BaseContainer
          title="Users ready to play:"
          className="gamesetup container"
        >
          {usersContent}
          <br></br>
          <Button
            width="100%"
            onClick={startGame}
            disabled={!isGamemaster || showGameSettings || users.length <= 1}
          >
            Start Game
          </Button>
          <br></br>
          {
            <Button
              width="100%"
              onClick={showSettingsContainer}
              disabled={!isGamemaster || showGameSettings}
            >
              Game Settings
            </Button>
          }
          <br></br>
          <Button width="100%" onClick={leaveGame}>
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

GameSetup.propTypes = {
  client: PropTypes.object.isRequired, // Validate prop type
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
