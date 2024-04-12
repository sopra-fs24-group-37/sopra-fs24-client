import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types"; // If you have a User type defined
import { Button } from "components/ui/Button";
import "styles/views/GameSetup.scss";

const GameSetup = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('userId');

  const isGamemaster = state?.gameMasterId === currentUser;

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Example function to fetch players (you need to implement this based on your backend API)
  const fetchPlayers = async () => {
    try {
      const response = await api.get("/game/players"); // Adjust the API endpoint as necessary
      setPlayers(response.data);
    } catch (error) {
      console.error(`Could not fetch players: ${handleError(error)}`);
    }
  };

  const startGame = () => {
    // Implementation to start the game
    console.log("Game is starting...");
  };

  return (
    <div className="flex-center-wrapper">
      <BaseContainer title="Game setup" className="game container">
        <div>Waiting for other players to join...</div>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.username}</li>
          ))}
        </ul>
        {isGamemaster && players.length > 1 && (
          <Button width="100%" onClick={startGame} disabled={players.length <= 1}>
            Start Game
          </Button>
        )}
        <Button width="100%" onClick={() => navigate("/lobby")}>Back to Lobby</Button>
      </BaseContainer>
    </div>
  );
};


export default GameSetup;