import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer } from "react-leaflet";

const SwissMap = () => {
  const swissBounds = [
    [45.817995, 5.956083], // Southwest corner of Switzerland
    [47.808455, 10.492294] // Northeast corner of Switzerland
  ];
  
  const mapRef = useRef(null); // Ref to the MapContainer component
  
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.fitBounds(swissBounds);
      }
    });

    if (mapRef.current && mapRef.current.getContainer()) {
      observer.observe(mapRef.current.getContainer()); // Observe the container of the Map
    }
    
    return () => observer.disconnect(); // Clean up the observer when the component unmounts
  }, [mapRef.current]); // Dependency array ensures this effect runs when the mapRef changes

  return (
    <MapContainer
      ref={(ref) => {
        if (ref && !mapRef.current) {
          mapRef.current = ref;
          ref.fitBounds(swissBounds); // Fit bounds when map is initially created
        }
      }}
      center={[46.1, 8.2]}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default SwissMap;
