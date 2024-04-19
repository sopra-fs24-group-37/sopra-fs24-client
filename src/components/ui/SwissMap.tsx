import React from "react";
import { MapContainer, TileLayer, ImageOverlay, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import imageUrl from "../../images/map.png";  // Adjust the relative path as necessary

const bounds = [
  [43.48, 0.065],
  [50.69, 16.65],
];

interface SwissMapProps {
  onMapClick: (latlng: L.LatLng) => void;
  selectedLocation?: L.LatLng;
  imageLocation?: L.LatLng;
}

const SwissMap: React.FC<SwissMapProps> = ({ onMapClick, selectedLocation, imageLocation }) => {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng);
      },
    });
    
    return null;
  }

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
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ImageOverlay url={imageUrl} bounds={bounds} />
      <LocationMarker />
      {selectedLocation && (
        <Marker position={selectedLocation}>
          <Popup>Your guess</Popup>
        </Marker>
      )}
      {imageLocation && (
        <Marker position={imageLocation}>
          <Popup>Actual location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default SwissMap;
