import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GameRound = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState({ lat: 46.8182, lng: 8.2275 }); // Default coordinates for Switzerland

  // Fetch an image from Unsplash
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
          params: { query: 'Switzerland landscape' },
          headers: {
            Authorization: `Client-ID YOUR_UNSPLASH_ACCESS_KEY`
          }
        });
        setImageUrl(response.data.urls.regular);
      } catch (error) {
        console.error('Failed to fetch image from Unsplash:', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        {imageUrl && <img src={imageUrl} alt="Swiss Landscape" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1 }}>
        <MapContainer center={[location.lat, location.lng]} zoom={8} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              A beautiful spot in Switzerland. Click to guess the location of the picture!
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default GameRound;
