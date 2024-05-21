import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";
import "styles/views/Login.scss";

const FormField = (props) => {
  const inputType =
    props.label.toLowerCase() === "password" ? "password" : "text";

  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={inputType}
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

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
  const [user, setUser] = useState<User>(null); // Change to single user
  const { userId } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + userId);

        setUser(response.data);

        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

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
  }, [userId]);

  const handleUsernameChange = async () => {
    try {
      const response = await api.put(`/users/${userId}`, {
        userId: userId,
        username: newUsername,
      });
      setUser(response.data);
      setShowEdit(false);
    } catch (error) {
      console.error(
        `Something went wrong while updating the username: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while updating the username! See the console for details."
      );
    }
  };

  const loggedInUserId = sessionStorage.getItem("userId");

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="profile container">
        <div className="profile title">{user.username}&apos;s Profile</div>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        <p>
          <strong>Games played:</strong> {user.gamesPlayed}
        </p>
        <p>
          <strong>Games won:</strong> {user.gamesWon}
        </p>
        <p>
          <strong>Points scored:</strong> {user.totalScores}
        </p>
        {loggedInUserId === userId && (
          <>
            <Button width="100%" onClick={() => setShowEdit(true)}>
              Change Username
            </Button>
            {showEdit && (
              <>
                <div
                  className="overlay"
                  onClick={() => setShowEdit(false)}
                ></div>
                <div className="edit-form">
                  <FormField
                    label="New Username"
                    value={newUsername}
                    onChange={(un: string) => setNewUsername(un)}
                  />
                  <Button width="100%" onClick={handleUsernameChange}>
                    Save
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        <br />
        <Button width="100%" onClick={() => navigate("/lobby")}>
          Go back to Lobby
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="flex-center-wrapper">{content}</BaseContainer>
  );
};

export default Profile;
