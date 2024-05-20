import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Waiting.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api } from "helpers/api";
import ResultMap from "components/ui/ResultMap";

const Waiting = () => {
  const [roundStats, setRoundStats] = useState([]);
  const [actualLocation, setActualLocation] = useState({ lat: 0, lng: 0 });
  const gameId = sessionStorage.getItem("gameId");
  const userId = parseInt(sessionStorage.getItem("userId"), 10); // Convert to integer
  const [gameEnd, setGameEnd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`round/${gameId}/leaderboard`);
        console.log("Results from last round:", response);
        setRoundStats(response.data.roundStats);
        setActualLocation({
          lat: response.data.latitude,
          lng: response.data.longitude,
        });
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
    };

    const fetchGameInfo = async () => {
      try {
        const gameInfoResponse = await api.get(`/games/${gameId}`);
        const gameInfo = gameInfoResponse.data;
        console.log("Game Info:", gameInfo);
        if (gameInfo.gameStatus === "ENDED") {
          setGameEnd(true);
        }
      } catch (error) {
        console.error("Failed to fetch game info:", error);
      }
    };

    fetchLeaderboard();
    fetchGameInfo();

    const timer = setTimeout(() => {
      if (gameEnd) {
        navigate(`/gamepodium/${gameId}`);
      } else {
        navigate(`/gameround/${gameId}`);
      }
    }, 10000);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameId, navigate, gameEnd]);

  const handleBeforeUnload = (event) => {
    api.put(`/games/${gameId}/leave`, userId);
    sessionStorage.removeItem("gameId");
  };

  const renderScores = () => (
    <ul className="no-bullets">
      {roundStats.map((stat) => (
        <li key={stat.gamePlayer.playerId}>
          {stat.gamePlayer.user.userId === userId
            ? `You have scored ${stat.pointsInc} points in the last round!`
            : `${stat.gamePlayer.user.username} has scored ${stat.pointsInc} points in the last round!`}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex-center-wrapper">
      <div className="container-wrapper">
        <BaseContainer
          title="Round results:"
          className="waiting-container"
        >
          {renderScores()}
          <br />
          <span className="bold-helvetica">Get ready for the next round!</span>
        </BaseContainer>
        <BaseContainer className="map-container">
          <ResultMap
            actualLocation={actualLocation}
            playerGuesses={roundStats}
            userId={userId}
          />
        </BaseContainer>
      </div>
    </div>
  );
};

export default Waiting;
