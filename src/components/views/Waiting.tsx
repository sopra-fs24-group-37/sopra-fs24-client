import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Waiting.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api } from "helpers/api";

const Waiting = () => {
  const [roundStats, setRoundStats] = useState([]);
  const gameId = sessionStorage.getItem("gameId");
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("round/" + gameId + "/leaderboard");
        console.log(response);
        setRoundStats(response.data.roundStats);
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

  return (
    <div className="flex-center-wrapper">
      <BaseContainer
        title="Here are your current scores:"
        className="waiting-container"
      >
        <ul className="no-bullets">
          {roundStats.map((stat) => (
            <li key={stat.gamePlayer.playerId}>
              {stat.gamePlayer.user.username} has scored {stat.gamePlayer.score} points so far!
            </li>
          ))}
        </ul>
        <br></br>
        <span className="bold-helvetica">Get ready for the next round!</span>
      </BaseContainer>
    </div>
  );
};

export default Waiting;
