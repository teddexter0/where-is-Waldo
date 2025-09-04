import React from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ì¥ç Where's Waldo?</h1>
        <p>Find all the hidden characters as quickly as possible!</p>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
