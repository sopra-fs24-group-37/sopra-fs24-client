import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import { Button } from "components/ui/Button";
import ConfirmLeave from "components/ui/ConfirmLeave";
import GameSettings from "./GameSettings"; // Import the GameSettings component
import PropTypes from "prop-types";

const GameSetup = ({ client }) => {
  const [players, setPlayers] = useState<User[]>([]);
  const [showGameSettings, setShowGameSettings] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem("userId");
  const gameId = sessionStorage.getItem("gameId");
  const [users, setUsers] = useState<User[]>(null);
  const [isGamemaster, setIsGamemaster] = useState(false);
  const [pin, setPin] = useState("");
  const [showConfirmLeave, setShowConfirmLeave] = useState(false); // New state for ConfirmLeave

  useEffect(() => {
    const updateSubscription = client.subscribe(
      "/topic/games/" + gameId,
      (message) => {
        console.log(`Received: ${message.body}`);
        const gameData = JSON.parse(message.body);
        const numRounds = gameData.numRounds;
        const guessTime = gameData.guessTime;
        const password = gameData.password;
        console.log("Number of Rounds:", numRounds);
        console.log("Guess Time:", guessTime);
        console.log("Password:", password);

        const gameMasterPresent = gameData.players.some(
          (player) => player.user.userId === gameData.gameMaster
        );
        if (!gameMasterPresent) {
          console.log("HOST DISCONNECTED");
          leaveGame();
        }

        const updatedUsers = gameData.players.map((player) => ({
          username: player.user.username,
        }));
        setUsers(updatedUsers);
        setPin(password);
        setIsGamemaster(gameData.gameMaster === parseInt(currentUser));
      }
    );
    const startSubscription = client.subscribe(
      "/topic/games/" + gameId + "/started",
      (message) => {
        console.log(`Received: ${message.body}`);
        navigate("/gameround/" + gameId);
      }
    );
    client.publish({
      destination: "/app/games/" + gameId + "/joining",
      body: gameId,
    });

    return () => {
      // Cleanup subscriptions
      updateSubscription.unsubscribe();
      startSubscription.unsubscribe();
    };
  }, [client, gameId, currentUser, navigate]);

  const confirmLeave = () => {
    setShowConfirmLeave(true); // Show ConfirmLeave component
  };

  const handleLeaveConfirmation = () => {
    leaveGame();
    setShowConfirmLeave(false); // Hide ConfirmLeave component after leave action
  };

  const handleLeaveCancel = () => {
    setShowConfirmLeave(false); // Hide ConfirmLeave component if canceled
  };

  const startGame = async () => {
    try {
      const response = await api.put(`/games/${gameId}/start`);
      client.publish({
        destination: "/app/games/" + gameId + "/started",
        body: gameId,
      });
      if (response.status === 200) {
        sessionStorage.removeItem("guessTime");
        sessionStorage.removeItem("numRounds");
        sessionStorage.removeItem("setGamePassword");
        navigate("/gameround/" + gameId);
      } else {
        console.error(`Starting game failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Starting game failed: ${handleError(error)}`);
    }
  };

  const leaveGame = async () => {
    try {
      const currentUserId = sessionStorage.getItem("userId");
      const response = await api.put(`/games/${gameId}/leave`, currentUserId);
      if (response.status === 200) {
        client.publish({
          destination: "/app/games/" + gameId + "/joining",
          body: gameId,
        });
        sessionStorage.removeItem("guessTime");
        sessionStorage.removeItem("numRounds");
        sessionStorage.removeItem("setGamePassword");
        sessionStorage.removeItem("gameId");
        navigate("/lobby");
      } else {
        console.error(`Leaving game failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Leaving game failed: ${handleError(error)}`);
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
      <ul
        className="gamesetup user-list"
        title="This user has joined your game"
      >
        {users.map((user, index) => (
          <div className="gamesetup user-container" key={index}>
            <li className="gamesetup user-container user-item">
              {user.username}
            </li>
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
          {pin && (
            <div className="gamesetup-row">
              <div className="gamesetup explanation">
                PIN: {pin && pin.toString().replace(/(\d{3})(\d{3})/, "$1 $2")}
              </div>
            </div>
          )}
          <br></br>
          <Button
            width="100%"
            onClick={startGame}
            title="Click here to start the game"
            disabled={
              !isGamemaster ||
              showGameSettings ||
              users.length <= 1 ||
              users.length > 2
            }
          >
            Start Game
          </Button>
          <br></br>
          {
            <Button
              width="100%"
              onClick={showSettingsContainer}
              disabled={!isGamemaster || showGameSettings}
              title="Click here to adjust the game settings"
            >
              Game Settings
            </Button>
          }
          <br></br>
          <Button
            width="100%"
            onClick={confirmLeave}
            title="Click here to go back to the lobby"
          >
            Back to Lobby
          </Button>
        </BaseContainer>
      )}
      {showConfirmLeave && (
        <ConfirmLeave
          onConfirm={handleLeaveConfirmation}
          onCancel={handleLeaveCancel}
        />
      )}
      {showGameSettings && (
        <GameSettings
          client={client}
          hideSettingsContainer={hideSettingsContainer}
        />
      )}
    </div>
  );
};

GameSetup.propTypes = {
  client: PropTypes.object.isRequired,
};

export default GameSetup;
