import React from "react";
import PropTypes from "prop-types";
import "styles/ui/GameParameters.scss";
import BaseContainer from "components/ui/BaseContainer";

const GameParameters = ({ username }) => {
  return (
    <BaseContainer className="username base-container">
      <p className="username title">Logged in as: {username}</p>
    </BaseContainer>
  );
};

GameParameters.propTypes = { username: PropTypes.string.isRequired };

export default GameParameters;
