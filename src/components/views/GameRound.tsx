import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { api, handleError } from "helpers/api";
import { User } from "types"; // If you have a User type defined
import { Button } from "components/ui/Button";
import "styles/views/GameRound.scss";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GameRound = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos/random", {
          params: { query: "Switzerland landscape" },
          headers: {
            Authorization: "Client-ID ACCESS_KEY"
          }
        });
        if (response.data && response.data.urls && response.data.urls.regular) {
          setImageUrl(response.data.urls.regular);
          if (response.data.location && response.data.location.position) {
            setLocation({
              lat: response.data.location.position.latitude,
              lng: response.data.location.position.longitude
            });
          }
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
    <div style={{ display: "flex" }}>
      <div className="flex-center-wrapper">
        <BaseContainer title="Make your guess!" className="game container">
          {imageUrl && <img src={imageUrl} alt="Swiss Landscape" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </BaseContainer>
      </div>
      <div className="flex-center-wrapper">
        <BaseContainer title="Map" className="game container">
          <div style={{ flex: 1 }}>
            <MapContainer center={[location.lat, location.lng]} zoom={8} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </BaseContainer>
    </div>
  </div>
  );
};

export default GameRound;
