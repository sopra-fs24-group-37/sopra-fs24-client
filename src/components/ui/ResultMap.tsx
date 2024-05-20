import React from "react";
import {
  MapContainer,
  FeatureGroup,
  GeoJSON,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import swissBoundaries from "../../geodata/switzerland.json";
import blackIcon from "../../images/black_icon.svg";
import blueIcon from "../../images/blue_icon.svg";
import greenIcon from "../../images/green_icon.svg";
import pinkIcon from "../../images/pink_icon.svg";
import purpleIcon from "../../images/purple_icon.svg";

const bounds = [
  [45.49, 5.73], // South-West
  [48.05, 10.71], // North-East
];

const minZoom = 7.6; // Adjust according to your needs
const maxZoom = 10; // Adjust according to your needs

interface ResultMapProps {
  actualLocation: { lat: number; lng: number };
  playerGuesses: any[];
  userId: number; // Add userId to the props
}

// Function to create custom icons
const createIcon = (iconUrl: string) =>
  new L.Icon({
    iconUrl,
    iconSize: [30, 42], // Size of the icon
    iconAnchor: [15, 42], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -42], // Point from which the popup should open relative to the iconAnchor
  });

const ResultMap: React.FC<ResultMapProps> = ({
  actualLocation,
  playerGuesses,
  userId, // Destructure userId from props
}) => {
  const swissStyle = {
    color: "#E993E6", // Color for the boundary
    fillColor: "#F1BCEF", // Color for the fill
    fillOpacity: 0.3, // 30% opacity for the area fill
    weight: 6, // Width of the boundary line
    opacity: 1, // Opacity of the boundary line
  };

  // Create icons for each marker
  const blackMarkerIcon = createIcon(blackIcon);
  const pinkMarkerIcon = createIcon(pinkIcon);
  const purpleMarkerIcon = createIcon(purpleIcon);
  const blueMarkerIcon = createIcon(blueIcon);
  const greenMarkerIcon = createIcon(greenIcon);
  const otherIcons = [blueMarkerIcon, greenMarkerIcon, purpleMarkerIcon];

  return (
    <MapContainer
      center={[46.8, 8.225]}
      zoom={7.6}
      zoomSnap={0.1} // Allow fractional zoom levels at increments of 0.1
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBounds={bounds} // Set the max bounds for movement on the map
      maxBoundsViscosity={1.0} // Makes the bounds fully 'solid', preventing the user from dragging outside
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}" />
      <FeatureGroup>
        <GeoJSON data={swissBoundaries} style={swissStyle} />
      </FeatureGroup>
      <Marker position={[actualLocation.lat, actualLocation.lng]} icon={blackMarkerIcon}>
        <Popup>Actual location</Popup>
      </Marker>
      {playerGuesses.map((stat) => {
        const guess = stat.guess;
        const isCurrentUser = stat.gamePlayer.user.userId === userId;
        const icon = isCurrentUser ? pinkMarkerIcon : otherIcons[playerGuesses.indexOf(stat) % otherIcons.length];

        const popupText = isCurrentUser
          ? "Your guess"
          : `${stat.gamePlayer.user.username}'s guess`;

        return (
          <Marker key={stat.gamePlayer.playerId} position={[guess[0], guess[1]]} icon={icon}>
            <Popup>{popupText}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default ResultMap;
