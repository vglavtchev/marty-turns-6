import React, { useState, useEffect } from "react";
import marty from "./static/marty_db.jpg";
import './App.css';

function App(props) {
  // Hooks for time and window size.
  const [time, setTime] = useState(Date.now());
  const {width} = useWindowSize();

  // Time update hook
  useEffect(() => {
    let interval = setInterval(() => setTime(Date.now()), 1000);
    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  const isMobile = width <= 800;

  let countDownDate = new Date("Oct 4, 2019 0:00:00").getTime();
  let now = time;

  // Find the distance between now and the count down date
  let distance = countDownDate - now;
  let isBirthday = (countDownDate - now) < 0;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Countdown component
  const Countdown = () => {
    const boldStyle = (
      isMobile ? (
        {fontSize: '2rem'}
      ) : (
        {fontSize: '3rem'}
      )
    );

    const regularStyle = (
      isMobile ? (
        {fontSize: '1rem'}
      ) : (
        {fontSize: '2rem'}
      )
    );

    return (
      <>
      <p className="fg-text-bold" style={boldStyle}>
        MARTY turns 6 in...
      </p>
      <p style={regularStyle}>
        {days} days 
      </p>
      <p style={regularStyle}>
        {hours} hours 
      </p>
      <p style={regularStyle}>
        {minutes} minutes
      </p>
      <p style={regularStyle}>
        {seconds} seconds
      </p>
      </>)
    }

  // Congrats component
  const Congrats = ({time}) => {
    const textSize = isMobile ? '2rem' : '3rem';
    if ( (time / 1000).toFixed(0) % 2 === 0) {
      return (
        <>
          <p className="fg-text-bold" style={{color: 'yellow', fontSize: textSize}}>
          HAPPY BIRTHDAY, MARTY!!!
          </p>
        </>)
    } else {
      return (
        <>
          <p className="fg-text-bold" style={{color: 'white', fontSize: textSize}}>
          HAPPY BIRTHDAY, MARTY!!!
          </p>
        </>)
    }
  }

  // Desktop component
  const DesktopLayout = () => {
    return (
      <>
        <div className="column">
          <img src={marty} style = {{height: window.innerHeight + 'px'}} alt=''></img>
        </div>
        <div className="column">
          <div className="fg-text">
            {
              isBirthday ? (
                <Congrats time={now}></Congrats>
                ) : (
                <Countdown></Countdown>
                ) 
            }
          </div>
        </div>
      </>
    )
  }

  // Mobile component
  const MobileLayout = () => {
    return (
      <>
        <div className="column">
          <div className="fg-text">
          {
              isBirthday ? (
                <Congrats time={now}></Congrats>
                ) : (
                <Countdown></Countdown>
                ) 
            }      
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="module">
      <div className="centered">
        <div className="row">
          {
            isMobile ? (<MobileLayout></MobileLayout>) : (<DesktopLayout></DesktopLayout>)
          }
        </div>
      </div>
    </div>
  );
}

// Hook
function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }
    
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default App;
