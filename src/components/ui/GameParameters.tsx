import React from "react";
import PropTypes from "prop-types";
import "styles/ui/GameParameters.scss";
import BaseContainer from "components/ui/BaseContainer";

const GameParameters = ({ numRounds, guessTime }) => {
  const defaultGuessTime = guessTime || 30;
  const defaultNumRounds = numRounds || 3;

  return (
    <BaseContainer className="parameter base-container">
      <p className="parameter title">Game Settings:</p>
      <p className="parameter description">
        Number of Rounds: {defaultNumRounds}
      </p>
      <p className="parameter description">
        Time to guess: {defaultGuessTime}s
      </p>
    </BaseContainer>
  );
};

GameParameters.propTypes = {
  numRounds: PropTypes.any.isRequired,
  guessTime: PropTypes.any.isRequired,
};

export default GameParameters;
