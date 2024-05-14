import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GameSetup.scss";

const GameSettings = ({ client, currentTimerValue, hideSettingsContainer }) => {
  const [guessTime, setSelectedTimer] = useState(currentTimerValue);
  const [numRounds, setSelectedRounds] = useState(currentRoundsValue);
  const [setGamePassword, setSetGamePassword] = useState(false); // New state for toggling game password
  const gameId = sessionStorage.getItem("gameId");

  const handleLocalTimerChange = (event) => {
    setSelectedTimer(parseInt(event.target.value));
  };

  const changeRounds = (event) => {
    setSelectedRounds(parseInt(event.target.value));
  };

  const toggleGamePassword = () => {
    setSetGamePassword((prevState) => !prevState); // Toggle the current state
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
        <div className="gamesetup explanation">Number of Rounds:</div>
        <select value={guessTime} onChange={changeRounds}>
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
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
  currentTimerValue: PropTypes.number.isRequired,
  hideSettingsContainer: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

export default GameSettings;
