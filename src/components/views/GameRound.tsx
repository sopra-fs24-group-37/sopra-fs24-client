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


const GameRound = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 });
  const [timer, setTimer] = useState(10); 

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos/random", {
          params: { query: "Switzerland landscape cityscape" },
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
          }
        });
        // Check if location data is available in the response
        if (response.data && response.data.urls && response.data.urls.regular &&
        response.data.location && response.data.location.position &&
        response.data.location.position.latitude &&
        response.data.location.position.longitude) {

          setImageUrl(response.data.urls.regular); // Set the image URL

          // Set the location state
          setLocation({
            lat: response.data.location.position.latitude,
            lng: response.data.location.position.longitude
          });
          setTimer(10); // Reset and start the timer when a new image is fetched
        }
      } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
      }
    };

    fetchImage();
  }, []);

  // Example function to fetch players (you need to implement this based on your backend API)
  const fetchPlayers = async () => {
    try {
      const response = await api.get("/game/players"); // Adjust the API endpoint as necessary
      setPlayers(response.data);
    } catch (error) {
      console.error(`Could not fetch players: ${handleError(error)}`);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="flex-center-wrapper">
      <div className="gameround side-by-side-containers">
        <BaseContainer className="gameround container">
          {imageUrl && (
              <img src={imageUrl} alt="Swiss Landscape" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
          )}
        </BaseContainer>
        <BaseContainer title="Where was this image taken? Make your guess by clicking on the map!" className="gameround container" style={{ height: "600px" }}>
          <>
            <SwissMap />
            <br/>
            <Timer initialCount={10} className="gameround title-font" />
          </>
        </BaseContainer>
      </div>
    </div>
  );
};

export default GameRound;
