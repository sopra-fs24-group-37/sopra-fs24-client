import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GameSetup.scss";

const GameSettings = ({
  currentTimerValue,
  handleTimerChange,
  hideSettingsContainer,
}) => {
  const [selectedTimer, setSelectedTimer] = useState(currentTimerValue);

  const handleLocalTimerChange = (event) => {
    setSelectedTimer(parseInt(event.target.value));
  };

  const applyTimerChange = () => {
    localStorage.setItem("currentGuessTime", selectedTimer.toString());
    handleTimerChange(selectedTimer);
    hideSettingsContainer();
  };

  useEffect(() => {
    const savedTimerValue = localStorage.getItem("currentGuessTime");
    if (savedTimerValue) {
      setSelectedTimer(parseInt(savedTimerValue));
    }
  }, []);

  return (
    <BaseContainer title="Game Settings" className="gamesetup container">
      <div className="gamesetup-row">
        <div className="gamesetup explanation">Guessing Time:</div>
        <select value={selectedTimer} onChange={handleLocalTimerChange}>
          <option value={30}>30s</option>
          <option value={20}>20s</option>
          <option value={10}>10s</option>
        </select>
      </div>
      <br />
      <Button width="100%" onClick={hideSettingsContainer}>
        Cancel
      </Button>
      <br />
      <Button width="100%" onClick={applyTimerChange}>
        Apply
      </Button>
    </BaseContainer>
  );
};

GameSettings.propTypes = {
  currentTimerValue: PropTypes.number.isRequired,
  handleTimerChange: PropTypes.func.isRequired,
  hideSettingsContainer: PropTypes.func.isRequired,
};

export default GameSettings;
