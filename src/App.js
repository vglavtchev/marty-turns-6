import React from 'react';
import Game from './Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="hud">
        <h1>HAPPY BIRTHDAY MARTY!</h1>
        <p>Use WASD or Arrow Keys to Drive</p>
      </div>
      <Game />
    </div>
  );
}

export default App;
