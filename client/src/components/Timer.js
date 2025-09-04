
// ===== client/src/components/Timer.js =====
import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

const Timer = ({ isActive, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let intervalId;
    
    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds(seconds => {
          const newTime = seconds + 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(intervalId);
    }
    
    return () => clearInterval(intervalId);
  }, [isActive, seconds, onTimeUpdate]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <span className="timer-label">Time: </span>
      <span className="timer-value">{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;
