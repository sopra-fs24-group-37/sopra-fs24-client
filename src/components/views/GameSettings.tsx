import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GameSetup.scss";

const GameSettings = ({ client, hideSettingsContainer }) => {
  const [guessTime, setGuessTime] = useState(
    parseInt(sessionStorage.getItem("guessTime")) || null
  );
  const [numRounds, setNumRounds] = useState(
    parseInt(sessionStorage.getItem("numRounds")) || null
  );
  const [setGamePassword, setSetGamePassword] = useState(
    sessionStorage.getItem("setGamePassword") === "true" || false
  );
  const gameId = sessionStorage.getItem("gameId");

  const handleLocalTimerChange = (event) => {
    const selectedTime = parseInt(event.target.value);
    setGuessTime(selectedTime);
  };

  const changeRounds = (event) => {
    const selectedRounds = parseInt(event.target.value);
    setNumRounds(selectedRounds);
  };

  const toggleGamePassword = () => {
    if (!setGamePassword) {
      setSetGamePassword(true);
    }
  };

  const applySettings = () => {
    const payload = {
      numRounds: numRounds,
      guessTime: guessTime,
      setGamePassword: setGamePassword,
    };
    //console.log(payload);
    client.publish({
      destination: `/app/games/${gameId}/settings`,
      body: JSON.stringify(payload),
    });
    sessionStorage.setItem("guessTime", guessTime);
    sessionStorage.setItem("numRounds", numRounds);
    sessionStorage.setItem("setGamePassword", setGamePassword);

    //console.log("Settings update message published.");
    hideSettingsContainer();
  };

  return (
    <BaseContainer title="Game Settings" className="gamesetup container">
      <div className="gamesetup-row">
        <div className="gamesetup explanation">Number of Rounds:</div>
        <select value={numRounds} onChange={changeRounds}>
          <option value={3}>3</option>
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
        <label htmlFor="gamePassword" className="label-custom">
          🔒 Private Game
        </label>
        <input
          id="gamePassword"
          type="checkbox"
          checked={setGamePassword}
          onChange={toggleGamePassword}
          disabled={setGamePassword} // Disable the checkbox if it's already checked
          className="checkbox-custom"
        />
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
