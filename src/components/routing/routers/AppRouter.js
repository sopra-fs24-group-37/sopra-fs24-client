import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LobbyGuard} from "../routeProtectors/LobbyGuard";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Lobby from "../../views/Lobby";
import Login from "../../views/Login";
import Registration from "../../views/Registration";
import Landing from "../../views/Landing";
import Profile from "../../views/Profile";
import GameSetup from "../../views/GameSetup";
import GameRound from "../../views/GameRound";
import GamePodium from "../../views/GamePodium";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/lobby".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /lobby renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/lobby/*" element={<LobbyGuard />}>
          <Route path="/lobby/*" element={<Lobby base="/lobby"/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/registration" element={<LoginGuard />}>
          <Route path="/registration" element={<Registration/>} />
        </Route>

        <Route path="/profile/:userId" element={<LobbyGuard />}>
          <Route path="/profile/:userId" element={<Profile/>} />
        </Route>

        <Route path="/gamesetup" element={<LobbyGuard />}>
          <Route path="/gamesetup" element={<GameSetup />} />
        </Route>

        <Route path="/gameround" element={<LobbyGuard />}>
          <Route path="/gameround" element={<GameRound />} />
        </Route>

        <Route path="/gamepodium" element={<LobbyGuard />}>
          <Route path="/gamepodium" element={<GamePodium />} />
        </Route>

        <Route path="/" element={
          <Navigate to="/lobby" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
