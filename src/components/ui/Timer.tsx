import React, { useEffect, useState } from "react";

interface TimerProps {
  initialCount: number;
  onTimeUp: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ initialCount, onTimeUp, className }) => {
  const [timer, setTimer] = useState(initialCount);

  useEffect(() => {
    // Create an interval that ticks every second
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 1) {
          return prevTimer - 1;
        } else {
          clearInterval(interval); // Clear interval when reaching zero
          onTimeUp();              // Call the onTimeUp callback
          return 0;                // Ensure timer is set to zero
        }
      });
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [onTimeUp]);

  return (
    <div className={className}>
      {timer > 0 ? `Time left: ${timer} seconds` : "Time's up!"}
    </div>
  );
};

export default Timer;
