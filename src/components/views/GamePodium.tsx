import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/GamePodium.scss";

const GamePodium = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);  // State to store leaderboard data

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const gameId = sessionStorage.getItem("gameId");  // Retrieve gameId from session storage
      if (!gameId) {
        console.error("Game ID is missing from session storage");
        
        return;
      }

      try {
        // Fetch the leaderboard data using Axios
        const response = await api.get(`/games/${gameId}/leaderboard`);
        const sortedPlayers = response.data.players.sort((a, b) => b.score - a.score);
        setPlayers(sortedPlayers);
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const goToLobby = () => {
    navigate("/lobby");
  };

  return (
    <div className="flex-center-wrapper">
      <BaseContainer title="Podium view" className="gamepodium container">
        <ol>
          {players.map((player, index) => (
            <li key={index}>{player.user.username}: {player.score}</li>
          ))}
        </ol>
        <br />
        <Button width="100%" onClick={goToLobby}>
          Go back to Lobby
        </Button>
      </BaseContainer>
    </div>
  );
};

export default GamePodium;
