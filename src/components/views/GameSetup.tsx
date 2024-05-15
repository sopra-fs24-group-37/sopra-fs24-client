import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import { Button } from "components/ui/Button";
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

  useEffect(() => {
    const updateSubscription = client.subscribe(
      "/topic/games/" + gameId,
      (message) => {
        console.log(`Received: ${message.body}`);
        const gameData = JSON.parse(message.body);
        const numRounds = gameData.numRounds;
        const guessTime = gameData.guessTime;
        const setGamePassword = gameData.setGamePassword;
        console.log("Number of Rounds:", numRounds);
        console.log("Guess Time:", guessTime);
        console.log("Password:", setGamePassword);
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
    const confirmLeave = window.confirm("Do you want to leave this Lobby?");
    if (confirmLeave) {
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
