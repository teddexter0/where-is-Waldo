const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage
let characters = [
  { _id: '1', name: 'Waldo', xPercentage: 78.5, yPercentage: 85.2, tolerance: 3 },
  { _id: '2', name: 'Wizard', xPercentage: 25.1, yPercentage: 72.4, tolerance: 3 },
  { _id: '3', name: 'Wilma', xPercentage: 52.8, yPercentage: 45.6, tolerance: 3 }
];

let scores = [];

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: 'waldo-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Routes
app.get('/api/characters', (req, res) => {
  res.json(characters.map(char => ({ _id: char._id, name: char.name })));
});

app.post('/api/characters/start-game', (req, res) => {
  req.session.gameStartTime = Date.now();
  req.session.charactersFound = [];
  req.session.gameActive = true;
  res.json({ message: 'Game started!', totalCharacters: characters.length });
});

app.post('/api/characters/validate', (req, res) => {
  const { characterName, xPercentage, yPercentage } = req.body;
  
  if (!req.session.gameActive) {
    return res.status(400).json({ error: 'No active game session' });
  }
  
  if (req.session.charactersFound?.includes(characterName)) {
    return res.json({ success: false, message: 'Character already found!' });
  }
  
  const character = characters.find(char => char.name === characterName);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  
  const xDiff = Math.abs(character.xPercentage - xPercentage);
  const yDiff = Math.abs(character.yPercentage - yPercentage);
  const isValid = xDiff <= character.tolerance && yDiff <= character.tolerance;
  
  if (isValid) {
    if (!req.session.charactersFound) req.session.charactersFound = [];
    req.session.charactersFound.push(characterName);
    
    const gameComplete = req.session.charactersFound.length === characters.length;
    
    if (gameComplete) {
      req.session.gameActive = false;
      req.session.completionTime = Math.floor((Date.now() - req.session.gameStartTime) / 1000);
    }
    
    res.json({
      success: true,
      message: `Found ${characterName}!`,
      characterPosition: { xPercentage: character.xPercentage, yPercentage: character.yPercentage },
      gameComplete,
      completionTime: gameComplete ? req.session.completionTime : null,
      totalFound: req.session.charactersFound.length,
      totalCharacters: characters.length
    });
  } else {
    res.json({ success: false, message: `${characterName} is not here. Keep looking!` });
  }
});

app.post('/api/scores', (req, res) => {
  const { playerName } = req.body;
  
  if (!req.session.completionTime || req.session.gameActive) {
    return res.status(400).json({ error: 'Invalid game state' });
  }
  
  if (!playerName?.trim()) {
    return res.status(400).json({ error: 'Player name required' });
  }
  
  const newScore = {
    _id: Date.now().toString(),
    playerName: playerName.trim(),
    completionTime: req.session.completionTime,
    dateCompleted: new Date()
  };
  
  scores.push(newScore);
  scores.sort((a, b) => a.completionTime - b.completionTime);
  
  req.session.completionTime = null;
  
  const position = scores.findIndex(score => score._id === newScore._id) + 1;
  res.json({ message: 'Score submitted!', score: newScore, position });
});

app.get('/api/scores/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topScores = scores.slice(0, limit);
  res.json(topScores);
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server running!', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('No database needed - using in-memory storage');
});