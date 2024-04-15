// Timer.tsx
import React, { useEffect, useState } from 'react';

// Extend the interface to include className
interface TimerProps {
  initialCount: number;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ initialCount, className }) => {
    const [timer, setTimer] = useState(initialCount);
    const [timeIsUp, setTimeIsUp] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const timeout = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timeout);
        } else {
            setTimeIsUp(true);
        }
    }, [timer]);

    return (
      <div className={className}>
        {timer > 0 ? `Time left: ${timer} seconds` : "Time's up!"}
      </div>
    );
};

export default Timer;
