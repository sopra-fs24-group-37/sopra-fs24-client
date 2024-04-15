import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    {/* <div className="player name">{user.name}</div> */}
    {/* <div className="player id">id: {user.id}</div> */}
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Lobby = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState
  const [users, setUsers] = useState<User[]>(null);

  const logout = (): void => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const [games, setGames] = useState([]);

  const initiateGame = async () => {
    try {
      const currentUserId = sessionStorage.getItem("userId");
      // const response = await api.post("/games", { gameMasterId: currentUserId }); // COMMENTED OUT FOR TESTING PURPOSES
      // setGames([...games, { ...response.data, gameMasterId: currentUserId }]); // COMMENTED OUT FOR TESTING PURPOSES
      // navigate("/gamesetup", { state: { gameMasterId: currentUserId } });
      navigate("/gamesetup");
    } catch (error) {
      console.error(`Game creation failed: ${handleError(error)}`);
    }
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="lobby">
        <ul className="lobby user-list">
          {users.map((user: User) => (
            <li key={user.id} onClick={() => navigate("/profile/" + user.id)}>
              <Player user={user} />
            </li>
          ))}
        </ul>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-center-wrapper">
      <div className="lobby side-by-side-containers">
        <BaseContainer title="Registered users" className="lobby container">
          <p className="lobby paragraph">
            The following users have registered:
          </p>
          {content}
        </BaseContainer>
        <BaseContainer title="Games" className="lobby container">
          <div className="games-list">
            {games.map((game) => (
              <div key={game.id} onClick={() => navigate("/gamesetup")}>
                {game.name}
              </div>
            ))}
          </div>
          <Button
            className="align-self-end"
            width="100%"
            onClick={initiateGame}
          >
            Initiate new game
          </Button>
        </BaseContainer>
      </div>
    </div>
  );
};

export default Lobby;