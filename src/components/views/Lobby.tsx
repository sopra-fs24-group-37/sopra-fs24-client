import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";
import Game from "models/Game";
import infoIcon from "../../images/info_icon.svg";
import InfoWindow from "./InfoWindow";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
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

  useEffect(() => {
    const userSubscription = client.subscribe(
      "/topic/users/getUsers",
      (message) => {
        const updatedUsers = JSON.parse(message.body);
        setUsers(updatedUsers);
        console.log("Updated users list received:", updatedUsers);
      }
    );

    const gameSubscription = client.subscribe(
      "/topic/games/getGames",
      (message) => {
        const updatedGames = JSON.parse(message.body);
        const filteredGames = updatedGames.filter(
          (game) => game.gameStatus === "WAITING"
        );
        setGames(filteredGames);
        console.log("Updated games list received:", filteredGames);
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

  // shows info screen upon click
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  /*  Here come a bunch of functions used in the components further down this file. */

  const logout = (): void => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  const initiateGame = async () => {
    try {
      const currentUserId = sessionStorage.getItem("userId");
      console.log("Current UserID:", currentUserId); // Log the value of currentUserId
      const response = await api.post("/games", { gameMaster: currentUserId });
      const games = new Game(response.data);
      sessionStorage.setItem("gameId", games.gameId);
      if (response.status === 201) {
        client.publish({
          destination: "/app/games/updateGames",
        });
        // Game created successfully, navigate to the game setup page
        navigate(`/gamesetup/${games.gameId}`);
      } else {
        // Handle other HTTP status codes if needed
        console.error(`Game creation failed with status: ${response.status}`);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error(`Game creation failed: ${handleError(error)}`);
    }
  };

  const joinGame = async (gameId: string) => {
    try {
      // Fetch game details before attempting to join
      const gameResponse = await api.get(`/games/${gameId}`);
      const game = gameResponse.data;

      if (!game.password) {
        // If the game's password is null
        const currentUserId = sessionStorage.getItem("userId");
        console.log("Current GameID:", gameId);
        const response = await api.put(`/games/${gameId}/join`, currentUserId);
        const games = new Game(response.data);
        sessionStorage.setItem("gameId", games.gameId);

        if (response.status === 200) {
          // Game joined successfully, navigate to the game setup page
          navigate(`/gamesetup/${games.gameId}`);
        } else {
          // Handle other HTTP status codes if needed
          console.error(`Joining game failed with status: ${response.status}`);
        }
      } else {
        console.log(
          `Game ${gameId} has a password and cannot be joined automatically`
        );
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error(`Joining game failed: ${handleError(error)}`);
    }
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
          <li key={game.gameId} onClick={() => joinGame(game.gameId)}>
            <div className="lobby game-container">
              {getUserUsername(game.gameMaster)}&apos;s Game
            </div>
          </li>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-center-wrapper">
      <img
        src={infoIcon}
        alt="Info"
        className="info-icon"
        onClick={toggleInfo}
        title="Click here to see the game rules"
      />
      {showInfo && <InfoWindow onClose={() => setShowInfo(false)} />}
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
