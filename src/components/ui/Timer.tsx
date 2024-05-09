import React, { useEffect, useState } from "react";

interface TimerProps {
  initialCount: number;
  onTimeUp: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ initialCount, onTimeUp, className }) => {
  const [endTime, setEndTime] = useState(Date.now() + initialCount * 1000);
  const [remainingTime, setRemainingTime] = useState(initialCount);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime < endTime) {
        const remaining = Math.round((endTime - currentTime) / 1000);
        setRemainingTime(remaining);
      } else {
        clearInterval(interval);
        onTimeUp();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  return (
    <div className={className}>
      {endTime > Date.now()
        ? `Time left: ${remainingTime} seconds`
        : "Time's up!"}
    </div>
  );
};

export default Timer;
