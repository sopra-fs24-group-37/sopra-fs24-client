import React from "react";
import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import imageUrl from "../../images/map.png";
import blackIcon from "../../images/black_icon.svg";
import blueIcon from "../../images/blue_icon.svg";
import greenIcon from "../../images/green_icon.svg";
import pinkIcon from "../../images/pink_icon.svg";
import purpleIcon from "../../images/purple_icon.svg";

const bounds = [
  [43.48, 0.065],
  [50.69, 16.65],
];

const minZoom = 7; // Adjust according to your needs
const maxZoom = 3; // Adjust according to your needs

interface SwissMapProps {
  onMapClick: (latlng: L.LatLng) => void;
  selectedLocation?: L.LatLng;
  imageLocation?: L.LatLng;
}

// Function to create custom icons
const createIcon = (iconUrl: string) =>
  new L.Icon({
    iconUrl,
    iconSize: [30, 42], // Size of the icon
    iconAnchor: [15, 42], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -42], // Point from which the popup should open relative to the iconAnchor
  });

const SwissMap: React.FC<SwissMapProps> = ({
  onMapClick,
  selectedLocation,
  imageLocation,
}) => {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng);
      },
    });

    return null;
  }

  // Create icons for each marker
  const blackMarkerIcon = createIcon(blackIcon);
  const blueMarkerIcon = createIcon(blueIcon);
  const greenMarkerIcon = createIcon(greenIcon);
  const pinkMarkerIcon = createIcon(pinkIcon);
  const purpleMarkerIcon = createIcon(purpleIcon);

  return (
    <MapContainer
      center={[46.8, 8.2]}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      minZoom={minZoom}
      maxZoom={maxZoom}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ImageOverlay url={imageUrl} bounds={bounds} />
      <LocationMarker />
      {selectedLocation && (
        <Marker position={selectedLocation} icon={pinkMarkerIcon}>
          <Popup>Your guess</Popup>
        </Marker>
      )}
      {imageLocation && (
        <Marker position={imageLocation} icon={blackMarkerIcon}>
          <Popup>Actual location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default SwissMap;