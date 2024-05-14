import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GameSetup.scss";

const GameSettings = ({ client, hideSettingsContainer }) => {
  const [guessTime, setSelectedTimer] = useState(
    sessionStorage.getItem("guessTime") || null
  );
  const [numRounds, setSelectedRounds] = useState(
    sessionStorage.getItem("numRounds") || null
  );
  const [setGamePassword, setSetGamePassword] = useState(
    sessionStorage.getItem("setGamePassword") === "true" || false
  ); // New state for toggling game password
  const gameId = sessionStorage.getItem("gameId");

  const handleLocalTimerChange = (event) => {
    const selectedTime = parseInt(event.target.value);
    setSelectedTimer(selectedTime);
    sessionStorage.setItem("guessTime", String(selectedTime));
  };

  const changeRounds = (event) => {
    const selectedRounds = parseInt(event.target.value);
    setSelectedRounds(selectedRounds);
    sessionStorage.setItem("numRounds", String(selectedRounds));
  };

  const toggleGamePassword = () => {
    const newValue = !setGamePassword;
    setSetGamePassword(newValue);
    sessionStorage.setItem("setGamePassword", String(newValue));
  };

  const applySettings = () => {
    client.publish({
      destination: `/app/games/${gameId}/settings`,
      body: numRounds,
      guessTime,
      setGamePassword,
    });

    console.log("Settings update message published.");

    // Hide the settings container
    hideSettingsContainer();
  };

  return (
    <BaseContainer title="Game Settings" className="gamesetup container">
      <div className="gamesetup-row">
        <div className="gamesetup explanation">Number of Rounds:</div>
        <select value={numRounds} onChange={changeRounds}>
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
      <br />
      <br />
      <div className="gamesetup-row">
        <div className="gamesetup explanation">Guessing Time:</div>
        <select value={guessTime} onChange={handleLocalTimerChange}>
          <option value={30}>30s</option>
          <option value={20}>20s</option>
          <option value={10}>10s</option>
        </select>
      </div>
      <br />
      <br />
      <div className="gamesetup-row">
        <input
          type="checkbox"
          checked={setGamePassword}
          onChange={toggleGamePassword}
        />
        <label>Set Game Password</label>
      </div>
      <br />
      <br />
      <Button width="100%" onClick={hideSettingsContainer}>
        Cancel
      </Button>
      <br />
      <Button width="100%" onClick={applySettings}>
        Apply
      </Button>
    </BaseContainer>
  );
};

GameSettings.propTypes = {
  hideSettingsContainer: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

export default GameSettings;
