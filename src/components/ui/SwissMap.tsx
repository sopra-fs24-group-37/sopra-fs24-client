import React, { useEffect, useState } from "react";
import {
  MapContainer,
  FeatureGroup,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import swissBoundaries from "../../geodata/switzerland.json";
import swissCantons from "../../geodata/cantons.json";
import blackIcon from "../../images/black_icon.svg";
import blueIcon from "../../images/blue_icon.svg";
import greenIcon from "../../images/green_icon.svg";
import pinkIcon from "../../images/pink_icon.svg";
import purpleIcon from "../../images/purple_icon.svg";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";

const bounds = [
  [45.49, 5.73], // South-West
  [48.05, 10.71], // North-East
];

const minZoom = 7.6; // Adjust according to your needs
const maxZoom = 10; // Adjust according to your needs

interface SwissMapProps {
  onMapClick: (latlng: L.LatLng) => void;
  selectedLocation?: L.LatLng;
  imageLocation?: L.LatLng;
  showCanton?: boolean;
  cantonLocation?: {
    lat: number;
    lng: number;
  };
  additionalCantons?: any[]; // Array to hold additional cantons to highlight
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
  showCanton,
  cantonLocation,
  additionalCantons,
}) => {
  const [cantonHighlight, setCantonHighlight] = useState(null);

  useEffect(() => {
    let highlights = [];
    if (showCanton && cantonLocation) {
      const clickedPoint = point([cantonLocation.lng, cantonLocation.lat]);
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
        highlights.push(foundCanton);
      }
    }
    if (additionalCantons && additionalCantons.length > 0) {
      additionalCantons.forEach((canton) => {
        highlights.push(canton);
      });
    }
    setCantonHighlight(highlights); // Update to handle an array of highlights
  }, [showCanton, cantonLocation, additionalCantons]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng);
      },
    });

    return null;
  }

  const swissStyle = {
    color: "#E993E6", // Color for the boundary
    fillColor: "#F1BCEF", // Color for the fill
    fillOpacity: 0.3, // 30% opacity for the area fill
    weight: 6, // Width of the boundary line
    opacity: 1, // Opacity of the boundary line
  };

  const cantonStyle = {
    color: "#73E4BC", // Color for the boundary
    fillColor: "#73E4BC", // Color for the fill
    fillOpacity: 0.5, // 50% opacity for the area fill
  };

  // Create icons for each marker
  const blackMarkerIcon = createIcon(blackIcon);
  const blueMarkerIcon = createIcon(blueIcon);
  const greenMarkerIcon = createIcon(greenIcon);
  const pinkMarkerIcon = createIcon(pinkIcon);
  const purpleMarkerIcon = createIcon(purpleIcon);

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
        {cantonHighlight &&
          cantonHighlight.map((canton, index) => (
            <GeoJSON
              key={canton.properties.kan_code}
              data={canton}
              style={cantonStyle}
            />
          ))}
      </FeatureGroup>
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
