import React, { Component } from "react";
import marty from "./static/marty_db.jpg";
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Date.now(),
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange)
    clearInterval(this.interval);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };
  
  render() {
    const { width } = this.state;
    const isMobile = width <= 800;

    let countDownDate = new Date("Oct 4, 2019 0:00:00").getTime();
    let now = this.state.time;

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
      if ( (time / 1000).toFixed(0) % 2 == 0) {
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
            <img src={marty} style = {{height: window.innerHeight + 'px'}}></img>
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
}

export default App;
