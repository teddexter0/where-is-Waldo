// ===== client/src/components/Game.js =====
import React, { useState, useEffect, useRef } from 'react';
import TargetingBox from './TargetingBox';
import Timer from './Timer';
import Leaderboard from './Leaderboard';
import NameModal from './NameModal';
import '../styles/Game.css';

const Game = () => {
  const [characters, setCharacters] = useState([]);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [targetingBox, setTargetingBox] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [message, setMessage] = useState('');
  const [characterMarkers, setCharacterMarkers] = useState([]);
  
  const imageRef = useRef(null);
  const API_BASE = '/api';

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE}/characters`);
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setMessage('Failed to load characters');
    }
  };

  const startGame = async () => {
    try {
      const response = await fetch(`${API_BASE}/characters/start-game`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setGameStarted(true);
        setFoundCharacters([]);
        setCharacterMarkers([]);
        setGameComplete(false);
        setMessage('');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setMessage('Failed to start game');
    }
  };

  const handleImageClick = (e) => {
    if (!gameStarted || gameComplete) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercentage = (x / rect.width) * 100;
    const yPercentage = (y / rect.height) * 100;

    setTargetingBox({
      x: e.clientX,
      y: e.clientY,
      xPercentage,
      yPercentage
    });
  };

  const handleCharacterSelect = async (characterName) => {
    if (!targetingBox) return;

    try {
      const response = await fetch(`${API_BASE}/characters/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          characterName,
          xPercentage: targetingBox.xPercentage,
          yPercentage: targetingBox.yPercentage
        })
      });

      const result = await response.json();

      if (result.success) {
        setFoundCharacters(prev => [...prev, characterName]);
        setCharacterMarkers(prev => [...prev, {
          name: characterName,
          xPercentage: result.characterPosition.xPercentage,
          yPercentage: result.characterPosition.yPercentage
        }]);
        
        if (result.gameComplete) {
          setGameComplete(true);
          setCompletionTime(result.completionTime);
          setShowNameModal(true);
        }
      }
      
      setMessage(result.message);
      setTargetingBox(null);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error validating character:', error);
      setMessage('Validation failed');
      setTargetingBox(null);
    }
  };

  const closeTargetingBox = () => {
    setTargetingBox(null);
  };

  const handleNameSubmit = () => {
    setShowNameModal(false);
    setShowLeaderboard(true);
  };

  const remainingCharacters = characters.filter(
    char => !foundCharacters.includes(char.name)
  );

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-info">
          <Timer 
            isActive={gameStarted && !gameComplete} 
            onTimeUpdate={() => {}} 
          />
          <div className="character-counter">
            Found: {foundCharacters.length} / {characters.length}
          </div>
        </div>
        
        {!gameStarted ? (
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <button className="restart-button" onClick={() => window.location.reload()}>
            Restart Game
          </button>
        )}
        
        <button 
          className="leaderboard-button"
          onClick={() => setShowLeaderboard(true)}
        >
          View Leaderboard
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Found') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="remaining-characters">
        <h3>Find these characters:</h3>
        <div className="character-list">
          {remainingCharacters.map(char => (
            <span key={char._id} className="character-name">
              {char.name}
            </span>
          ))}
        </div>
      </div>

      <div className="game-image-container">
        <img
          ref={imageRef}
          src="/images/waldo-scene.jpg"
          alt="Where's Waldo Scene"
          className="game-image"
          onClick={handleImageClick}
          draggable={false}
        />
        
        {characterMarkers.map(marker => (
          <div
            key={marker.name}
            className="character-marker"
            style={{
              left: `${marker.xPercentage}%`,
              top: `${marker.yPercentage}%`
            }}
          >
            <div className="marker-circle"></div>
            <div className="marker-label">{marker.name}</div>
          </div>
        ))}
      </div>

      {targetingBox && (
        <TargetingBox
          x={targetingBox.x}
          y={targetingBox.y}
          characters={remainingCharacters}
          onSelect={handleCharacterSelect}
          onClose={closeTargetingBox}
        />
      )}

      {showNameModal && (
        <NameModal
          completionTime={completionTime}
          onSubmit={handleNameSubmit}
          onClose={() => setShowNameModal(false)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};

export default Game;