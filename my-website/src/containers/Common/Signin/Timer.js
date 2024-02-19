import React, { useState } from "react";

const Timer = () => {
  const [time, setTime] = useState({ s: 5 });

  const startTimer = () => {
    let myInterval = setInterval(() => {
      setTime((time) => {
        const updatedTime = { ...time };
        if (time.s > 0) {
          updatedTime.s--;
        }
        if (time.s === 0) {
          clearInterval(myInterval);
        }
        return updatedTime;
      });
    }, 1000);
  };

  return (
    <div>
      <h1 className="timer">{time.s < 10 ? `0${time.s}` : time.s}</h1>
      <button onClick={startTimer}>START</button>
    </div>
  );
};

export default Timer;
