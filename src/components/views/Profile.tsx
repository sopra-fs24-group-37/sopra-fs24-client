import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
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

const Profile = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
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

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

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
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <BaseContainer className="flex-center-wrapper">
      <div className="profile container">
        <div className="profile title">User Profile </div>
        <div style={{ textAlign: "left" }}>
          <p>
            <strong>Name:</strong> xxxx
          </p>
          <p>
            <strong>Name:</strong> xxxx
          </p>
          <p>
            <strong>Status:</strong> xxxx
          </p>
          <p>
            <strong>Games played:</strong> xxxx
          </p>
          <p>
            <strong>Games won:</strong> xxxx
          </p>
          <p>
            <strong>Points scored:</strong> xxxx
          </p>
        </div>
        <Button width="100%" onClick={() => navigate("/lobby")}>
          Go back to Lobby
        </Button>
      </div>
    </BaseContainer>
  );
};

export default Profile;
