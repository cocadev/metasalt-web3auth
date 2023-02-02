import React from 'react'
import { useState, useEffect } from 'react';

const Timer = (props) => {
  const { initialMinute = 0, initialSeconds = 0, onFinish } = props;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
          onFinish();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div>
      {minutes === 0 && seconds === 0
        ? null
        : <div className='f-16'> Wrong Password. please try again after {seconds < 10 ? `${seconds}` : seconds} seconds.</div>
      }
    </div>
  )
}

export default Timer;