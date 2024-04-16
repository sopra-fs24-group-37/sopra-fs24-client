import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, ImageOverlay } from 'react-leaflet';

const imageUrl = "/map.png";
const bounds = [[43.48,0.065], [50.69, 16.65]];

const SwissMap = () => {
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
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ImageOverlay
        url={imageUrl}
        bounds={bounds}
      />
    </MapContainer>
  );
};

export default SwissMap;
