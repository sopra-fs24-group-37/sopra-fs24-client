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
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("round/" + gameId + "/leaderboard");
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

    fetchLeaderboard();

    const timer = setTimeout(() => {
      navigate("/gameround/" + gameId);
    }, 5000);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameId, navigate]);

  const handleBeforeUnload = (event) => {
    api.put("/games/" + gameId + "/leave", userId);
    sessionStorage.removeItem("gameId");
  };

  const renderScores = () => (
    <ul className="no-bullets">
      {roundStats.map((stat) => (
        <li key={stat.gamePlayer.playerId}>
          {stat.gamePlayer.user.username} has scored {stat.gamePlayer.score} points so far!
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex-center-wrapper">
      <div className="container-wrapper">
        <BaseContainer
          title="Here are your current scores:"
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
          />
        </BaseContainer>
      </div>
    </div>
  );
};

export default Waiting;
