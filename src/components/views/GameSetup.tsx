import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import { Button } from "components/ui/Button";
import ConfirmLeave from "components/ui/ConfirmLeave";
import GameSettings from "./GameSettings";
import PropTypes from "prop-types";
import { Howl } from "howler";
import StartSound from "../../sounds/Start.mp3";
import UserName from "components/ui/UserName";
import GameParameters from "components/ui/GameParameters";

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
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [numRounds, setNumRounds] = useState(null);
  const [guessTime, setGuessTime] = useState(null);
  
  const playSound = () => {
    const sound = new Howl({
      src: [StartSound],
      autoplay: true,
      loop: false,
      volume: 0.5,
    });
  };

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
        sessionStorage.setItem("guessTime", guessTime);
        sessionStorage.setItem("numRounds", numRounds);

        const gameMasterPresent = gameData.players.some(
          (player) => player.user.userId === gameData.gameMaster
        );
        if (!gameMasterPresent) {
          toast.error(
            "The host has left the game. You're being redirected shortly!"
          );
          setTimeout(() => {
            leaveGame();
          }, 5000);
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
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
  const handleBeforeUnload = (event) => {
    const userId = sessionStorage.getItem("userId");
    api.put(`/games/${gameId}/leave`, userId);
    api.put(`/users/${userId}/logout`);
    sessionStorage.removeItem("gameId");
  };
  const startGame = async () => {
    setButtonsDisabled(true);
    playSound();
    setTimeout(async () => {
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
          sessionStorage.removeItem("powerupCount"); // safety measure
          sessionStorage.removeItem("gameEnd"); // safety measure
          navigate("/gameround/" + gameId);
        } else {
          console.error(`Starting game failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Starting game failed: ${handleError(error)}`);
      }
    }, 2000); // 2-second delay
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
      <UserName username={sessionStorage.getItem("username")} />
      <ToastContainer />
      {!showGameSettings && (
        <div className="gamesetup side-by-side-containers">
          <BaseContainer
            title="Users ready to play:"
            className="gamesetup container"
          >
            {usersContent}
            {pin && (
              <div className="gamesetup-row">
                <div className="gamesetup explanation">
                  PIN:{" "}
                  {pin && pin.toString().replace(/(\d{3})(\d{3})/, "$1 $2")}
                </div>
              </div>
            )}
            {users && users.length === 1 && (
              <div className="gamesetup-row">
                <div className="gamesetup explanation">
                  At least one more player is needed.
                </div>
              </div>
            )}
            {users && users.length > 4 && (
              <div className="gamesetup-row">
                <div className="gamesetup explanation">
                  A maximum of four players are allowed.
                </div>
              </div>
            )}   
            <br />
            <Button
              width="100%"
              onClick={startGame}
              title="Click here to start the game"
              disabled={
                buttonsDisabled || 
                !isGamemaster ||
                showGameSettings ||
                users.length <= 1 ||
                users.length > 4
              }
            >
              Start Game
            </Button>
            <br />
            <Button
              width="100%"
              onClick={showSettingsContainer}
              disabled={buttonsDisabled || !isGamemaster || showGameSettings}
              title="Click here to adjust the game settings"
            >
              Game Settings
            </Button>
            <br />
            <Button
              width="100%"
              onClick={confirmLeave}
              disabled={buttonsDisabled}
              title="Click here to go back to the lobby"
            >
              Back to Lobby
            </Button>
          </BaseContainer>
          <GameParameters
            numRounds={sessionStorage.getItem("numRounds")}
            guessTime={sessionStorage.getItem("guessTime")}
          />
        </div>
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
