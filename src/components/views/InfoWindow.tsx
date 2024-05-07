import React from "react";
import "styles/views/InfoWindow.scss";
import { Button } from "components/ui/Button";

interface InfoWindowProps {
    onClose: () => void; // Define the types for the props here
}

const InfoWindow: React.FC<InfoWindowProps> = ({ onClose }) => (
  <div className="info-window">
    <p><strong>SwissQuiz</strong> is a web application designed to offer an engaging and interactive learning experience centered around the geography of Switzerland. Users are shown random images of Swiss landscapes and cities from Unsplash, and are challenged to identify the locations on a map. Players can earn up to 100 points per round, with one point deducted for every kilometer of deviation from the correct location.</p>
    <Button width="100px" onClick={onClose}>Close</Button>
  </div>
);

export default InfoWindow;
