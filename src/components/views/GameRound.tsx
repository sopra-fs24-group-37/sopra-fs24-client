import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import "styles/views/GameRound.scss";
import SwissMap from "components/ui/SwissMap";
import "leaflet/dist/leaflet.css";
import Timer from "components/ui/Timer";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import swissCantons from "../../geodata/cantons.json";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { Howl } from "howler";
import StartSound from "../../sounds/Start.mp3";
import UserName from "components/ui/UserName";
import Powerup1 from "../../sounds/Powerup1.mp3";
import Powerup2 from "../../sounds/Powerup2.mp3";
import Powerup3 from "../../sounds/Powerup3.mp3";


const GameRound = ({ client }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 });
  const [photographer, setPhotographer] = useState("unknown");
  const [photographer_username, setPhotographerUsername] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [canInteract, setCanInteract] = useState(true);
  const gameId = sessionStorage.getItem("gameId");
  const userId = parseInt(sessionStorage.getItem("userId"), 10);
  const [roundSubscription, setRoundSubscription] = useState(null);
  const [endSubscription, setEndSubscription] = useState(null);
  const [showCanton, setShowCanton] = useState(false); // State to manage "power-up" activation
  const [additionalCantons, setAdditionalCantons] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [doubleScoreUsed, setDoubleScoreUsed] = useState(false);
  const [cantonHintUsed, setCantonHintUsed] = useState(false);
  const [tripleHintUsed, setTripleHintUsed] = useState(false);
  const [receivedEndTime, setEndTime] = useState(null);
  const [powerupCount, setPowerupCount] = useState(() => {
    const savedCount = sessionStorage.getItem("powerupCount");
    
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const sounds = [Powerup1, Powerup2, Powerup3];

  const playSound = (index) => {
    const soundInstance = new Howl({
      src: [sounds[index]],
      autoplay: true,
      loop: false,
      volume: 1.0,
    });
  };

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        const response = await api.get(`/games/${gameId}`);
        console.log("Game Info:", response.data);
        const player = response.data.players.find(
          (p) => p.user.userId === userId
        );
        setCurrentPlayer(player);
      } catch (error) {
        console.error("Error fetching game info:", handleError(error));
      }
    };

    fetchGameInfo();

    const roundSub = client.subscribe(
      `/topic/games/${gameId}/round`,
      (message) => {
        console.log(`Received: ${message.body}`);
        try {
          const jsonObject = JSON.parse(message.body);
          setImageUrl(jsonObject.regular_url);
          setLocation({
            lat: jsonObject.latitude,
            lng: jsonObject.longitude,
          });
          if (jsonObject.user_name) {
            setPhotographer(jsonObject.user_name);
          }
          if (jsonObject.user_username) {
            setPhotographerUsername(jsonObject.user_username);
          }
          if (jsonObject.end_time) {
            setEndTime(jsonObject.end_time);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    );
    setRoundSubscription(roundSub);

    const gameEndSubscription = client.subscribe(
      `/topic/games/${gameId}/ended`,
      (message) => {
        console.log(`Received: ${message.body}`);
        sessionStorage.setItem("gameEnd", "true");
      }
    );
    setEndSubscription(gameEndSubscription);

    client.publish({
      destination: `/app/games/${gameId}/checkin`,
      body: gameId,
    });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (roundSubscription) {
        roundSubscription.unsubscribe();
      }
      if (endSubscription) {
        endSubscription.unsubscribe();
      }
    };
  }, [client, gameId, userId]);

  useEffect(() => {
    sessionStorage.setItem("powerupCount", powerupCount);
  }, [powerupCount]);

  const handleMapClick = (latlng) => {
    if (canInteract) {
      setSelectedLocation(latlng);
    }
  };

  const handleCantonHint = () => {
    playSound(powerupCount);
    setPowerupCount((prevCount) => prevCount + 1);
    setShowCanton(true);
    setCantonHintUsed(true);
  };

  const handleTripleHint = () => {
    playSound(powerupCount);
    setPowerupCount((prevCount) => prevCount + 1);
    const cantonCode = getCantonCodeForLocation(location);
    console.log("Location kan_code (cantonCode):", cantonCode);

    const otherCantons = swissCantons.features.filter(
      (canton) => canton.properties.kan_code[0] !== cantonCode
    );
    console.log("Other cantons:", otherCantons);
    const shuffled = otherCantons.sort(() => 0.5 - Math.random());
    setAdditionalCantons(shuffled.slice(0, 2));
    setShowCanton(true);
    setTripleHintUsed(true);
  };

  const getCantonCodeForLocation = (location) => {
    const clickedPoint = point([location.lng, location.lat]);
    const foundCanton = swissCantons.features.find((feature) =>
      booleanPointInPolygon(
        clickedPoint,
        polygon(
          feature.geometry.type === "MultiPolygon"
            ? feature.geometry.coordinates[0]
            : feature.geometry.coordinates
        )
      )
    );

    if (foundCanton) {
      console.log("Found canton:", foundCanton.properties.kan_code[0]);

      return foundCanton.properties.kan_code[0];
    } else {
      console.log("No canton found for the given location");

      return null;
    }
  };

  const handleBeforeUnload = (event) => {
    api.put(`/games/${gameId}/leave`, userId);
    api.put(`/users/${userId}/logout`);
    sessionStorage.removeItem("gameId");
  };

  const handleTimeUp = () => {
    setCanInteract(false);
    const { lat, lng } = selectedLocation;
    console.log("Guessed coordinates:", lat, lng);

    const guessPayload = {
      latitude: lat,
      longitude: lng,
      userId: userId,
      useDoubleScore: doubleScoreUsed,
      useCantonHint: cantonHintUsed,
      useMultipleCantonHint: tripleHintUsed,
    };
    console.log("Data sent to backend:", guessPayload);

    client.publish({
      destination: `/app/games/${gameId}/guess`,
      body: JSON.stringify(guessPayload),
    });

    if (roundSubscription) {
      roundSubscription.unsubscribe();
    }
    if (endSubscription) {
      endSubscription.unsubscribe();
    }
    setTimeout(() => {
      navigate(`/gameround/${gameId}/waiting`);
    }, 5000);
  };


  const handleDoubleScore = () => {
    playSound(powerupCount);
    setPowerupCount((prevCount) => prevCount + 1);
    setDoubleScoreUsed(true);
  };

  return (
    <div className="flex-center-wrapper">
      <UserName username={sessionStorage.getItem("username")} />
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
                target="_blank"
                rel="noopener noreferrer"
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
              imageLocation={!canInteract ? location : undefined}
              showCanton={showCanton}
              cantonLocation={location}
              additionalCantons={additionalCantons}
            />
            <br />
            <Timer
              end_time={receivedEndTime}
              onTimeUp={handleTimeUp}
              className="gameround title-font"
            />
          </>
          <br />
          <div className="button-container">
            <Button
              title="Use this power-up to get double points for your guess. You can only use this power-up once per game!"
              disabled={!canInteract || doubleScoreUsed || !currentPlayer?.doubleScore}
              onClick={handleDoubleScore}
            >
              Double Score
            </Button>
            <Button
              title="Use this power-up to be shown the canton in which the image was taken. You can only use this power-up once per game!"
              disabled={
                !canInteract || cantonHintUsed || !currentPlayer?.cantonHint
              }
              onClick={handleCantonHint}
            >
              Canton Hint
            </Button>
            <Button
              title="Use this power-up to be shown three cantons in one of which the image was taken. You can only use this power-up once per game!"
              disabled={
                !canInteract ||
                tripleHintUsed ||
                !currentPlayer?.multipleCantonHint
              }
              onClick={handleTripleHint}
            >
              Triple Hint
            </Button>
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

GameRound.propTypes = {
  client: PropTypes.object.isRequired,
};

export default GameRound;
