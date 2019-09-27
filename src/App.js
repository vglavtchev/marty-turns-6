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
    // Countdown component
    const Countdown = () => {
      return (
        <>
        <p className="fg-text-bold">
          MARTY turns 6 in...
        </p>
        <p></p>
          {days} days 
        <p></p>
          {hours} hours 
        <p></p>
          {minutes} minutes
        <p></p>
          {seconds} seconds
        </>)
      }

    // Congrats component
    const Congrats = ({time}) => {
      if ( (time / 1000).toFixed(0) % 2 == 0) {
        return (
          <>
            <p className="fg-text-bold" style={{color: 'yellow'}}>
            HAPPY BIRTHDAY, MARTY!!!
            </p>
          </>)
      } else {
        return (
          <>
            <p className="fg-text-bold" style={{color: 'white'}}>
            HAPPY BIRTHDAY, MARTY!!!
            </p>
          </>)
      }
    }

    // Desktop component
    const DesktopLayout = ({isBirthday}) => {
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
    const MobileLayout = ({isBirthday}) => {
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
    let content;
  

    return (
      <div className="module">
        <div className="centered">
          <div className="row">
            {
              isMobile ? (<MobileLayout isBirthday={isBirthday}></MobileLayout>) : (<DesktopLayout isBirthday={isBirthday}></DesktopLayout>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
