import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Landing.scss";
import BaseContainer from "components/ui/BaseContainer";

const Waiting = () => {
  const gameId = sessionStorage.getItem("gameId");
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/gameround/" + gameId);
    }, 5000);

    return () => clearTimeout(timer);
  }, [gameId, navigate]);

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
