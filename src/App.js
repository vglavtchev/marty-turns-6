import React, { Component } from "react";
import marty from "./static/marty_db.jpg";
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
  let countDownDate = new Date("Oct 4, 2019 0:00:00").getTime();
  let now = this.state.time;

  // Find the distance between now and the count down date
  let distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let content;
  
   if (distance > 0) {
    content = (
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
    } else { 
      console.log('now: ', now);
      if ( (now / 1000) % 2 === 0) {
      content = (
        <>
          <p className="fg-text-bold" style={{color: 'white'}}>
          HAPPY BIRTHDAY, MARTY!!!
          </p>
        </>)
      } else {
        content = (
          <>
            <p className="fg-text-bold" style={{color: 'yellow'}}>
            HAPPY BIRTHDAY, MARTY!!!
            </p>
          </>)
      }

    }

  return (
  <div className="module">
    <div className="centered">
      <div className="row">
        <div className="column">
            <img src={marty} style = {{height: window.innerHeight + 'px'}}></img>
        </div>
        <div className="column">
          <div className="fg-text">
              {content}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
}


export default App;
