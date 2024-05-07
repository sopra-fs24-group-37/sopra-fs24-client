import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types";
import "styles/views/GameRound.scss";
import axios from "axios";
import SwissMap from "components/ui/SwissMap";
import "leaflet/dist/leaflet.css";
import Timer from "components/ui/Timer";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";

const GameRound = ({ client }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 });
  const [photographer, setPhotographer] = useState("unknown");
  const [photographer_username, setPhotographerUsername] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [canInteract, setCanInteract] = useState(true);
  const gameId = sessionStorage.getItem("gameId");
  const [timerExpired, setTimerExpired] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [gameEnd, setGameEnd] = useState(false);
  const [roundSubscription, setRoundSubscription] = useState(null);
  const [endSubscription, setEndSubscription] = useState(null);

  useEffect(() => {
    const roundSub = client.subscribe(
      "/topic/games/" + gameId + "/round",
      (message) => {
        console.log(`Received: ${message.body}`);
        try {
          const jsonObject = JSON.parse(message.body);
          setImageUrl(jsonObject.urls.regular);
          if (jsonObject.user.name) {
            setPhotographer(jsonObject.user.name);
          }
          if (jsonObject.user.username) {
            setPhotographerUsername(jsonObject.user.username);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    );
    setRoundSubscription(roundSub);

    const gameEndSubscription = client.subscribe(
      "/topic/games/" + gameId + "/ended",
      (message) => {
        console.log(`Received: ${message.body}`);
        setGameEnd(true);
      }
    );
    setEndSubscription(gameEndSubscription);

    client.publish({
      destination: "/app/games/" + gameId + "/checkin",
      body: gameId,
    });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleMapClick = (latlng) => {
    if (canInteract) {
      setSelectedLocation(latlng);
    }
  };

  const handleBeforeUnload = (event) => {
    api.put("/games/" + gameId + "/leave", userId);
    sessionStorage.removeItem("gameId");
  };
  /*
  const fetchImage = async (message) => {
    try {
      const response = await axios.get(
        "https://api.unsplash.com/photos/" + message,
        {
          headers: {
            Authorization:
              "Client-ID vzUYuzlG1QUpgAi-uyHM0Rdm9uEwmf6YCbUwHS6TVXI",
          },
        }
      );
      if (
        response.data &&
        response.data.urls &&
        response.data.urls.regular &&
        response.data.location &&
        response.data.location.position &&
        response.data.location.position.latitude &&
        response.data.location.position.longitude
      ) {
        setImageUrl(response.data.urls.regular);
        setLocation({
          lat: response.data.location.position.latitude,
          lng: response.data.location.position.longitude,
        });
        if (response.data.user.name) {
          setPhotographer(response.data.user.name);
        }
        if (response.data.user.username) {
          setPhotographerUsername(response.data.user.username);
        }
      }
    } catch (error) {
      console.error("Failed to fetch image from Unsplash:", error);
    }
  }; */

  const handleTimeUp = () => {
    setCanInteract(false); // This will disable map interaction when the timer expires
    setTimerExpired(true);
    const { lat, lng } = selectedLocation; //needs to be selected location
    console.log(lat, lng);
    client.publish({
      destination: "/app/games/" + gameId + "/guess",
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        userId: userId,
      }),
    });
    if (roundSubscription) {
      roundSubscription.unsubscribe();
    }
    if (endSubscription) {
      endSubscription.unsubscribe();
    }
    if (gameEnd) {
      setTimeout(() => {
        navigate("/gamepodium/" + gameId);
      }, 5000);
    } else {
      setTimeout(() => {
        navigate("/gameround/" + gameId + "/waiting");
      }, 5000);
    }
  };

  return (
    <div className="flex-center-wrapper">
      <div className="gameround side-by-side-containers">
        <BaseContainer
          className="gameround container"
          style={{ height: "650px" }}
        >
          {imageUrl && <img src={imageUrl} alt="Swiss Landscape" />}
          <br></br>
          {photographer_username !== "" && (
            <div>
              Photo by{" "}
              <a
                href={`https://unsplash.com/@${photographer_username}?utm_source=swissquiz&utm_medium=referral`}
              >
                {photographer}
              </a>{" "}
              on{" "}
              <a href="https://unsplash.com/?utm_source=swissquiz&utm_medium=referral">
                Unsplash
              </a>
            </div>
          )}
        </BaseContainer>
        <BaseContainer
          title="Where was this image taken? Make your guess by clicking on the map!"
          className="gameround container"
          style={{ height: "650px" }}
        >
          <>
            <SwissMap
              onMapClick={handleMapClick}
              selectedLocation={selectedLocation}
              imageLocation={!canInteract ? location : undefined} // Pass the image location when the interaction is disabled
            />
            <br />
            <Timer
              initialCount={15}
              onTimeUp={handleTimeUp}
              className="gameround title-font"
            />
          </>
        </BaseContainer>
      </div>
    </div>
  );
};

GameRound.propTypes = {
  client: PropTypes.object.isRequired, // Validate prop type
};

export default GameRound;
