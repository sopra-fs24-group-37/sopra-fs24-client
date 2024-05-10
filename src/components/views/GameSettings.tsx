import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/GameSetup.scss";

const GameSettings = ({
  timerValue,
  handleTimerChange,
  hideSettingsContainer,
}) => {
  return (
    <BaseContainer title="Game Settings" className="gamesetup container">
      <div className="gamesetup-row">
        <div className="gamesetup explanation">Guessing Time:</div>
        <select value={timerValue} onChange={handleTimerChange}>
          <option value={30}>30s</option>
          <option value={20}>20s</option>
          <option value={10}>10s</option>
        </select>
      </div>
      <br></br>
      <Button width="100%" onClick={hideSettingsContainer}>
        Cancel
      </Button>
      <br></br>
      <Button width="100%">Apply</Button>
    </BaseContainer>
  );
};

GameSettings.propTypes = {
  timerValue: PropTypes.number.isRequired,
  handleTimerChange: PropTypes.func.isRequired,
  hideSettingsContainer: PropTypes.func.isRequired,
};

export default GameSettings;
