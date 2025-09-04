const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// Get all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find({}, 'name');
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Start game
router.post('/start-game', async (req, res) => {
  try {
    req.session.gameStartTime = Date.now();
    req.session.charactersFound = [];
    req.session.gameActive = true;
    
    const totalCharacters = await Character.countDocuments();
    
    res.json({ 
      message: 'Game started!', 
      totalCharacters,
      sessionId: req.sessionID
    });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Validate character
router.post('/validate', async (req, res) => {
  try {
    const { characterName, xPercentage, yPercentage } = req.body;
    
    if (!req.session.gameActive) {
      return res.status(400).json({ error: 'No active game session' });
    }
    
    if (req.session.charactersFound && req.session.charactersFound.includes(characterName)) {
      return res.json({ 
        success: false, 
        message: 'Character already found!',
        alreadyFound: true
      });
    }
    
    const character = await Character.findOne({ name: characterName });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const xDiff = Math.abs(character.xPercentage - xPercentage);
    const yDiff = Math.abs(character.yPercentage - yPercentage);
    
    const isValid = xDiff <= character.tolerance && yDiff <= character.tolerance;
    
    if (isValid) {
      if (!req.session.charactersFound) {
        req.session.charactersFound = [];
      }
      req.session.charactersFound.push(characterName);
      
      const totalCharacters = await Character.countDocuments();
      const gameComplete = req.session.charactersFound.length === totalCharacters;
      
      if (gameComplete) {
        req.session.gameActive = false;
        const completionTime = Math.floor((Date.now() - req.session.gameStartTime) / 1000);
        req.session.completionTime = completionTime;
      }
      
      res.json({
        success: true,
        message: `Found ${characterName}! í¾‰`,
        characterPosition: {
          xPercentage: character.xPercentage,
          yPercentage: character.yPercentage
        },
        gameComplete,
        completionTime: gameComplete ? req.session.completionTime : null,
        totalFound: req.session.charactersFound.length,
        totalCharacters
      });
    } else {
      res.json({
        success: false,
        message: `${characterName} is not here. Keep looking! í´`
      });
    }
  } catch (error) {
    console.error('Error validating character:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

module.exports = router;
