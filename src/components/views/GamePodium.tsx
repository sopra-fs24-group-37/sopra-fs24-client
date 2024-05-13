import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/GamePodium.scss";
import Confetti from "react-confetti";

const GamePodium = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [celebration, setCelebration] = useState(false);  // State to control confetti

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const gameId = sessionStorage.getItem("gameId");
      if (!gameId) {
        console.error("Game ID is missing from session storage");
        return;
      }

      try {
        const response = await api.get(`/games/${gameId}/leaderboard`);
        const sortedPlayers = response.data.players.sort((a, b) => b.score - a.score);
        setPlayers(sortedPlayers);
        setCelebration(true);  // Trigger confetti on successful data fetch
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const goToLobby = () => {
    navigate("/lobby");
    setCelebration(false);  // Turn off confetti when leaving the page
  };

  return (
    <div className="flex-center-wrapper">
      {celebration && <Confetti />}
      <BaseContainer title="And the winner is ..." className="gamepodium container">
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
