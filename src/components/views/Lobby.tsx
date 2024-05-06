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

const Lobby = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const [games, setGames] = useState<Game[]>(null);
  const [showInfo, setShowInfo] = useState(false); // handels state of info screen

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
      const currentUserId = sessionStorage.getItem("userId");
      console.log("Current GameID:", gameId);
      const response = await api.put(`/games/${gameId}/join`, currentUserId);
      const games = new Game(response.data);
      sessionStorage.setItem("gameId", games.gameId);

      if (response.status === 200) {
        // Game created successfully, navigate to the game setup page
        navigate(`/gamesetup/${games.gameId}`);
      } else {
        // Handle other HTTP status codes if needed
        console.error(`Joining game failed with status: ${response.status}`);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error(`Joining game failed: ${handleError(error)}`);
    }
  };

  const getUserUsername = (userId: number): string => {
    const user = users.find((user) => user.userId === userId);

    return user ? user.username : "Unknown";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        ); /* Can be removed */
        // Get the returned users and update the state.
        setUsers(response.data);
        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    async function fetchGames() {
      try {
        const response = await api.get("/games");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const filteredGames = response.data.filter(
          (game) => game.gameStatus === "WAITING"
        );
        setGames(filteredGames);
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the games: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the games! See the console for details."
        );
      }
    }

    fetchData();
    fetchGames();
  }, []);

  let usersContent = <Spinner />;
  if (users) {
    usersContent = (
      <ul className="lobby user-list">
        {users.map((user: User & { userId: number }) => (
          <li key={user.userId} onClick={() => navigate(`/profile/${user.userId}`)}>
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
      <img src={infoIcon} alt="Info" className="info-icon" onClick={toggleInfo} />
      {showInfo && <InfoWindow onClose={() => setShowInfo(false)} />}
      <div className="lobby side-by-side-containers">
        <BaseContainer title="Registered users" className="lobby container">
          <p className="lobby paragraph">
            The following users have registered:
          </p>
          {usersContent}
          <Button width="100%" onClick={() => logout()}>
            Logout
          </Button>
        </BaseContainer>
        <BaseContainer title="Games" className="lobby container">
          {gamesContent}
          <Button
            className="align-self-end"
            width="100%"
            onClick={initiateGame}
          >
            Initiate new game
          </Button>
        </BaseContainer>
      </div>
    </div>
  );
};

export default Lobby;