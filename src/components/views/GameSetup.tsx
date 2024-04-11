import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types"; // If you have a User type defined
import { Button } from "components/ui/Button";
import "styles/views/Game.scss";

const GameSetup = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Example function to fetch players (you need to implement this based on your backend API)
  const fetchPlayers = async () => {
    try {
      const response = await api.get("/game/players"); // Adjust the API endpoint as necessary
      setPlayers(response.data);
    } catch (error) {
      console.error(`Could not fetch players: ${handleError(error)}`);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="flex-center-wrapper">
      <BaseContainer title="Game setup" className="game container">
        <div>Waiting for players...</div>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.username}</li>
          ))}
        </ul>
        <Button width="100%" onClick={() => navigate("/lobby")}>Back to Lobby
        </Button> 
      </BaseContainer>
    </div>
  );
};

export default GameSetup;