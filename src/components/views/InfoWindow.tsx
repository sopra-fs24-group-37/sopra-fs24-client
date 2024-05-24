import React from "react";
import "styles/views/InfoWindow.scss";
import { Button } from "components/ui/Button";

interface InfoWindowProps {
    onClose: () => void; // Define the types for the props here
}

const InfoWindow: React.FC<InfoWindowProps> = ({ onClose }) => (
  <div className="info-window">
    <p className="info-title">Rules of the Game</p>
    <p className="info-content">
      <strong>SwissQuiz</strong> is an interactive online quiz about the geography of Switzerland for up to four players. 
      In each round, you will see a random image from somewhere in Switzerland. Your task is to guess 
      where the image was taken by clicking on a map of Switzerland.

      <h2>Game Parameters</h2>
      The gamemaster, who initiates a game, can set a number of game parameters:
      <ul>
        <li><strong>Number of rounds</strong>: sets the number of rounds to be played in one game.</li>
        <li><strong>Guessing time</strong>: sets the time interval for making a guess.</li>
        <li><strong>Private game</strong>: will create a password for the game such that only players with the password can join it.</li>
      </ul>

      <h2>Scoring</h2>
      Points are awarded according to the following rules:
      <ul>
        <li>For a perfect guess, you will be awarded 100 points.</li>
        <li>For every kilometer off from the correct location, one point will be deducted,</li>
        <li>No points will be awarded if your guess is 100 kilometers or more off.</li>
      </ul>
      The player with the highest score at the end of the game wins!

      <h2>Power-Ups</h2>
      There are three power-ups, which you can use once in a game:
      <ul>
        <li><strong>Double Score</strong>: Doubles the points for the current round.</li>
        <li><strong>Canton Hint</strong>: Highlights the boundaries of the canton where the image was taken.</li>
        <li><strong>Triple Hint</strong>: Highlights the boundaries of three cantons, one of which is the canton where the image was taken.</li>
      </ul>
      Good luck and have fun exploring Switzerland with SwissQuiz!
    </p>
    <div className="button-container">
      <Button width="150px" onClick={onClose}>Close</Button>
    </div>
  </div>
);

export default InfoWindow;
