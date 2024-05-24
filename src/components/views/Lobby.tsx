import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/Lobby.scss";
import { User } from "types";
import Game from "models/Game";
import infoIcon from "../../images/info_icon.svg";
import InfoWindow from "./InfoWindow";
import GamePassword from "components/ui/GamePassword";
import UserName from "components/ui/UserName";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">💫 {user.username}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Lobby = ({ client }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const [games, setGames] = useState<Game[]>(null);
  const [showInfo, setShowInfo] = useState(false); // handles state of info screen
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>(null);

  useEffect(() => {
    const userSubscription = client.subscribe(
      "/topic/users/getUsers",
      (message) => {
        const updatedUsers = JSON.parse(message.body);
        setUsers(updatedUsers);
      }
    );

    const gameSubscription = client.subscribe(
      "/topic/games/getGames",
      (message) => {
        const updatedGames = JSON.parse(message.body);
        console.log("Incoming games JSON:", updatedGames); // Log the incoming games JSON
        const filteredGames = updatedGames.filter(
          (game) => game.gameStatus === "WAITING" && game.players.length < 4
        );
        setGames(filteredGames);
      }
    );

    client.publish({
      destination: "/app/users/updateUsers",
    });

    client.publish({
      destination: "/app/games/updateGames",
    });

    return () => {
      userSubscription.unsubscribe();
      gameSubscription.unsubscribe();
    };
  }, [client]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const logout = (): void => {
    const userId = sessionStorage.getItem("userId");
    api.put(`/users/${userId}/logout`);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  const initiateGame = async () => {
    try {
      const currentUserId = sessionStorage.getItem("userId");
      const response = await api.post("/games", { gameMaster: currentUserId });
      const games = new Game(response.data);
      sessionStorage.setItem("gameId", games.gameId);
      if (response.status === 201) {
        client.publish({
          destination: "/app/games/updateGames",
        });
        navigate(`/gamesetup/${games.gameId}`);
      } else {
        console.error(`Game creation failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Game creation failed: ${handleError(error)}`);
    }
  };

  const joinGame = async (gameId: string, password?: string) => {
    try {
      const currentUserId = sessionStorage.getItem("userId");
      const response = await api.put(`/games/${gameId}/join`, currentUserId, {
        params: { gamePassword: password || null },
      });

      const games = new Game(response.data);
      sessionStorage.setItem("gameId", games.gameId);

      if (response.status === 200) {
        navigate(`/gamesetup/${games.gameId}`);
        client.publish({
          destination: "/app/games/updateGames",
        });
      } else if (response.status === 401) {
        toast.error("Invalid password.");
      } else {
        console.error(`Joining game failed with status: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid password.");
      } else {
        console.error(`Joining game failed: ${handleError(error)}`);
      }
    }
  };

  const handleJoinGameClick = async (gameId: string) => {
    try {
      const gameResponse = await api.get(`/games/${gameId}`);
      const game = gameResponse.data;

      if (!game.password) {
        joinGame(gameId);
      } else {
        setSelectedGameId(gameId);
        setShowPasswordPrompt(true);
      }
    } catch (error) {
      console.error(`Fetching game details failed: ${handleError(error)}`);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    setShowPasswordPrompt(false);
    joinGame(selectedGameId, password);
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
  };

  const getUserUsername = (userId: number): string => {
    if (!users) {
      console.error("Users array is null or undefined");

      return "Unknown";
    }

    const user = users.find((user) => user.userId === userId);

    return user ? user.username : "Unknown";
  };

  let usersContent = <Spinner />;
  if (users) {
    usersContent = (
      <ul className="lobby user-list">
        {users.map((user: User & { userId: number }) => (
          <li
            key={user.userId}
            onClick={() => navigate(`/profile/${user.userId}`)}
            title="Click here to take a look at the user's profile"
          >
            <Player user={user} />
          </li>
        ))}
      </ul>
    );
  }

  let gamesContent = <Spinner />;
  if (games) {
    gamesContent = (
      <div className="lobby game-list">
        {games.map((game: Game) => (
          <li
            key={game.gameId}
            onClick={() => handleJoinGameClick(game.gameId)}
          >
            <div className="lobby game-container">
              🕹️ {getUserUsername(game.gameMaster)}&apos;s Game
            </div>
          </li>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-center-wrapper">
      <UserName username={sessionStorage.getItem("username")} />
      <ToastContainer />
      <img
        src={infoIcon}
        alt="Info"
        className="info-icon"
        onClick={toggleInfo}
        title="Click here to see the game rules"
      />
      {showInfo && <InfoWindow onClose={() => setShowInfo(false)} />}
      {showPasswordPrompt && (
        <GamePassword
          onSubmit={handlePasswordSubmit}
          onCancel={handlePasswordCancel}
        />
      )}
      <div className="lobby side-by-side-containers">
        <BaseContainer title="Registered users" className="lobby container">
          <p className="lobby paragraph">
            The following users have registered:
          </p>
          {usersContent}
          <Button
            width="100%"
            onClick={() => logout()}
            title="Click here to log out"
          >
            Logout
          </Button>
        </BaseContainer>
        <BaseContainer title="Games" className="lobby container">
          {gamesContent}
          <Button
            className="align-self-end"
            width="100%"
            onClick={initiateGame}
            title="Click here to initiate a new game"
          >
            Initiate new game
          </Button>
        </BaseContainer>
      </div>
    </div>
  );
};

Lobby.propTypes = {
  client: PropTypes.object.isRequired,
};

export default Lobby;
