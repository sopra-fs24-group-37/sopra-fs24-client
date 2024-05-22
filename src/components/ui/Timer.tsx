import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Timer = ({ end_time, onTimeUp, className }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeUpTriggered, setTimeUpTriggered] = useState(false);

  useEffect(() => {
    if (end_time) {
      const [endHours, endMinutes, endSeconds] = end_time.split(":");
      let [endSecondsPart, endMillisecondsPart] = endSeconds.split(".");

      // Limit milliseconds to three digits
      if (endMillisecondsPart && endMillisecondsPart.length > 3) {
        endMillisecondsPart = endMillisecondsPart.slice(0, 3);
      }

      const endTime = {
        hours: parseInt(endHours, 10),
        minutes: parseInt(endMinutes, 10),
        seconds: parseInt(endSecondsPart, 10),
        milliseconds: parseInt(endMillisecondsPart || "0", 10),
      };

      const intervalId = setInterval(() => {
        const now = new Date();
        const currentTime = {
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
          milliseconds: now.getMilliseconds(),
        };

        const distance = calculateTimeDifference(endTime, currentTime);

        if (distance <= 0) {
          clearInterval(intervalId);
          setTimeLeft(0);
          if (!timeUpTriggered) {
            setTimeUpTriggered(true);
            onTimeUp();
          }
        } else {
          setTimeLeft(distance);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [end_time, onTimeUp, timeUpTriggered]);

  const calculateTimeDifference = (endTime, currentTime) => {
    const endMillis =
      (endTime.hours * 3600 + endTime.minutes * 60 + endTime.seconds) * 1000 +
      endTime.milliseconds;
    const currentMillis =
      (currentTime.hours * 3600 +
        currentTime.minutes * 60 +
        currentTime.seconds) *
        1000 +
      currentTime.milliseconds;

    return endMillis - currentMillis;
  };

  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const seconds = totalSeconds % 60;

    return `Time remaining: ${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (timeLeft === null) {
    return <div className={className}>Loading...</div>;
  }

  return (
    <div className={className}>
      {timeLeft !== null ? formatTimeLeft(timeLeft) : "Loading..."}
    </div>
  );
};

Timer.propTypes = {
  end_time: PropTypes.string.isRequired,
  onTimeUp: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Timer;
