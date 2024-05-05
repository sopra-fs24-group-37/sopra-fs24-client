import React, { useEffect, useState } from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Lobby from "../../views/Lobby";
import PropTypes from "prop-types";
import { connectWebSocket, disconnectWebSocket } from "../../../helpers/stomp.js";


const LobbyRouter = () => {

  const [client, setClient] = useState(null);

  useEffect(() => {
    const newClient = connectWebSocket();
    setClient(newClient);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Lobby client={client} />} />

        <Route path="dashboard" element={<Lobby />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>
   
    </div>
  );
};
/*
* Don't forget to export your component!
 */

LobbyRouter.propTypes = {
  base: PropTypes.string
}

export default LobbyRouter;
