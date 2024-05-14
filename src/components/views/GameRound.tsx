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
import swissCantons from "../../geodata/cantons.json";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";

const GameRound = ({ client }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 });
  const [photographer, setPhotographer] = useState("unknown");
  const [photographer_username, setPhotographerUsername] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [canInteract, setCanInteract] = useState(true);
  const gameId = sessionStorage.getItem("gameId");
  const userId = sessionStorage.getItem("userId");
  const [gameEnd, setGameEnd] = useState(false);
  const [roundSubscription, setRoundSubscription] = useState(null);
  const [endSubscription, setEndSubscription] = useState(null);
  const [showCanton, setShowCanton] = useState(false);  // State to manage "power-up" activation
  const [additionalCantons, setAdditionalCantons] = useState([]);

  useEffect(() => {
    const roundSub = client.subscribe(
      "/topic/games/" + gameId + "/round",
      (message) => {
        console.log(`Received: ${message.body}`);
        try {
          const jsonObject = JSON.parse(message.body);
          setImageUrl(jsonObject.urls.regular);
          setLocation({
            lat: jsonObject.location.position.latitude,
            lng: jsonObject.location.position.longitude,
          });
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

  const handleCantonHint = () => {
    setShowCanton(true);  // Activate canton highlighting
  };

  const handleTripleHint = () => {
    const cantonCode = getCantonCodeForLocation(location); // Get the kan_code for the current location
    console.log("Location kan_code (cantonCode1):", cantonCode); // Log the location's kan_code

    const otherCantons = swissCantons.features.filter(canton => canton.properties.kan_code[0] !== cantonCode);
    console.log("Other cantons:", otherCantons); // Log the location's kan_code
    const shuffled = otherCantons.sort(() => 0.5 - Math.random());
    setAdditionalCantons(shuffled.slice(0, 2));
    setShowCanton(true);
  };
  
  const getCantonCodeForLocation = (location) => {
    const clickedPoint = point([location.lng, location.lat]);
    const foundCanton = swissCantons.features.find(feature =>
      booleanPointInPolygon(clickedPoint, polygon(feature.geometry.type === "MultiPolygon" ? feature.geometry.coordinates[0] : feature.geometry.coordinates))
    );

    if (foundCanton) {
      console.log("Found canton:", foundCanton.properties.kan_code[0]); // Log the found canton's kan_code
      return foundCanton.properties.kan_code[0]; // Access the first element of kan_code
    } else {
      console.log("No canton found for the given location");
      return null;
    }
  };

  const handleBeforeUnload = (event) => {
    api.put("/games/" + gameId + "/leave", userId);
    sessionStorage.removeItem("gameId");
  };

  const handleTimeUp = () => {
    setCanInteract(false); // This will disable map interaction when the timer expires
    const { lat, lng } = selectedLocation; // needs to be selected location
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
          style={{ height: "700px" }}
        >
          {imageUrl && <img src={imageUrl} alt="Swiss Landscape" />}
          <br></br>
          {photographer_username !== "" && (
            <div>
              Photo by{" "}
              <a
                href={`https://unsplash.com/@${photographer_username}?utm_source=swissquiz&utm_medium=referral`}
                target="_blank"
                rel="noopener noreferrer"          
              >
                {photographer}
              </a>{" "}
              on{" "}
              <a 
                href="https://unsplash.com/?utm_source=swissquiz&utm_medium=referral"
                target="_blank" // Opens link in a new window/tab
                rel="noopener noreferrer" // Security measure
              >
                Unsplash
              </a>
            </div>
          )}
        </BaseContainer>
        <BaseContainer
          title="Where was this image taken? Make your guess by clicking on the map!"
          className="gameround container"
          style={{ height: "700px" }}
        >
          <>
            <SwissMap
              onMapClick={handleMapClick}
              selectedLocation={selectedLocation}
              imageLocation={!canInteract ? location : undefined} // Pass the image location when the interaction is disabled
              showCanton={showCanton} // Pass the state to SwissMap
              cantonLocation={location} // Assuming `location` is the canton's actual location
              additionalCantons={additionalCantons}
            />
            <br />
            <Timer
              initialCount={15}
              onTimeUp={handleTimeUp}
              className="gameround title-font"
            />
          </>
          <br />
          <div className="button-container">
            <Button >Double Score</Button> 
            <Button onClick={handleCantonHint}>Canton Hint</Button>
            <Button onClick={handleTripleHint}>Triple Hint</Button>
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

GameRound.propTypes = {
  client: PropTypes.object.isRequired, // Validate prop type
};

export default GameRound;
