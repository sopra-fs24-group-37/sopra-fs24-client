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

const GameRound = ({ client }) => {
  const [players, setPlayers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [canInteract, setCanInteract] = useState(true); // State to control map interaction
  const gameId = sessionStorage.getItem("gameId");
  const [timerExpired, setTimerExpired] = useState(false);
  const userId = sessionStorage.getItem("userId")

  useEffect(() => {
    const fetchImage = async (message) => {
      try {
        const response = await axios.get(
          "https://api.unsplash.com/photos/" + message,
          {
            headers: {
              Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`,
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
        }
      } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
      }
    };
    const roundSubscription = client.subscribe("/topic/games/" + gameId + "/round",(message) => {
      console.log(`Received: ${message.body}`);
      fetchImage(message.body);
    });
    const gameEndSubscription = client.subscribe("/topic/games/" + gameId + "/ended",(message) => {
      console.log(`Received: ${message.body}`);
      navigate("/gamepodium/"+gameId)
    });
    client.publish({destination: "/app/games/" + gameId + "/checkin", body: gameId });
  }, []);

  const handleMapClick = (latlng) => {
    if (canInteract) {
      setSelectedLocation(latlng);
    }
  };

  const handleTimeUp = () => {
    setCanInteract(false); // This will disable map interaction when the timer expires
    setTimerExpired(true);
    const { lat, lng } = selectedLocation; //needs to be selected location
    console.log(lat,lng)
    client.publish({destination: "/app/games/" + gameId + "/guess",
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        userId: userId
      })
    });
  };

  const doStuff = () => {
    client.publish({destination: "/app/games/" + gameId + "/checkin", body: gameId });
  };

  return (
    <div className="flex-center-wrapper">
      <div className="gameround side-by-side-containers">
        <BaseContainer
          className="gameround container"
          style={{ height: "650px" }}
        >
          {imageUrl && <img src={imageUrl} alt="Swiss Landscape" />}
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
              initialCount={10}
              onTimeUp={handleTimeUp}
              className="gameround title-font"
            />
          </>
          {timerExpired && <button onClick={() => doStuff()}>Button</button>}
        </BaseContainer>
      </div>
    </div>
  );
};

GameRound.propTypes = {
  client: PropTypes.object.isRequired, // Validate prop type
};

export default GameRound;