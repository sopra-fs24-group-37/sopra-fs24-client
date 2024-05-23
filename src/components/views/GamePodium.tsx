import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/GamePodium.scss";
import Confetti from "react-confetti";
import PropTypes from "prop-types";

const GamePodium = ({ client }) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [celebration, setCelebration] = useState(false); // State to control confetti
  const gameId = sessionStorage.getItem("gameId");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const gameId = sessionStorage.getItem("gameId");
      if (!gameId) {
        console.error("Game ID is missing from session storage");
        return;
      }

      try {
        const response = await api.get(`/games/${gameId}/leaderboard`);
        const sortedPlayers = response.data.players.sort(
          (a, b) => b.score - a.score
        );
        setPlayers(sortedPlayers);
        setCelebration(true); // Trigger confetti on successful data fetch
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      }
    };

    client.publish({
      destination: `/app/games/${gameId}/checkin`,
      body: gameId,
    });

    fetchLeaderboard();
  }, [client, gameId]);

  const goToLobby = () => {
    navigate("/lobby");
    sessionStorage.removeItem("gameId");
    sessionStorage.removeItem("powerupCount");
    setCelebration(false); // Turn off confetti when leaving the page
  };

  const topThree = players.slice(0, 3);

  return (
    <div className="flex-center-wrapper">
      {celebration && <Confetti />}
      <BaseContainer title="And the winner is ..." className="gamepodium container">
        <div className="podium-container">
          {topThree.map((player, index) => (
            <div key={index} className={`podium-position position-${index + 1}`}>
              <div className="podium-rank">{index + 1}</div>
              <div className="podium-player">
                <div className="player-name">{player.user.username}</div>
                <div className="player-score">{player.score}</div>
              </div>
            </div>
          ))}
        </div>
        <br />
        <Button title="Click here to go back to the lobby" width="100%" onClick={goToLobby}>
          Go back to Lobby
        </Button>
      </BaseContainer>
    </div>
  );
};

GamePodium.propTypes = {
  client: PropTypes.object.isRequired,
};

export default GamePodium;
