import React from "react";
import PropTypes from "prop-types";
import "styles/ui/UserName.scss";
import BaseContainer from "components/ui/BaseContainer";

const UserName = ({ username }) => {
  return (
    <BaseContainer className="username base-container">
      <p className="username title">Logged in as: {username}</p>
    </BaseContainer>
  );
};

UserName.propTypes = { username: PropTypes.string.isRequired };

export default UserName;
