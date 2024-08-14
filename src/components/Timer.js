import { useEffect } from 'react';

function Timer({ dispatch, remainingTime }) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  //Start the Timer as soon as the Timer component mounts
  useEffect(
    function () {
      const timerId = setInterval(function () {
        dispatch({ type: 'tick' });
      }, 1000);

      return () => clearInterval(timerId);
    },

    [dispatch]
  );

  return (
    <div className="timer">
      {minutes < 10 && '0'}
      {minutes}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
}

export default Timer;
