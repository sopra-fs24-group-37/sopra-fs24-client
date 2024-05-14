import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Landing.scss";
import BaseContainer from "components/ui/BaseContainer";
import { api } from "helpers/api";

const Waiting = () => {
  const gameId = sessionStorage.getItem("gameId");
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  useEffect(() => {
    const response = api.get("round/" + gameId + "/leaderboard");
    console.log(response)
    const timer = setTimeout(() => {
      navigate("/gameround/" + gameId);
    }, 5000);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [gameId, navigate]);


  const handleBeforeUnload = (event) => {
    api.put("/games/" + gameId + "/leave", userId);
    sessionStorage.removeItem("gameId");
  };

  return (
    <div className="flex-center-wrapper">
      <BaseContainer
        title="Get ready for the next round!"
        className="gamepodium container"
      ></BaseContainer>
    </div>
  );
};

export default Waiting;
