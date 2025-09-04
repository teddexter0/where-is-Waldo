const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Submit score
router.post('/', async (req, res) => {
  try {
    const { playerName } = req.body;
    
    if (!req.session.completionTime || req.session.gameActive) {
      return res.status(400).json({ error: 'Invalid game state for score submission' });
    }
    
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }
    
    const newScore = new Score({
      playerName: playerName.trim(),
      completionTime: req.session.completionTime
    });
    
    await newScore.save();
    
    req.session.completionTime = null;
    
    const betterScores = await Score.countDocuments({
      completionTime: { $lt: newScore.completionTime }
    });
    
    res.json({
      message: 'Score submitted successfully!',
      score: newScore,
      position: betterScores + 1
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topScores = await Score.find()
      .sort({ completionTime: 1 })
      .limit(limit)
      .select('playerName completionTime dateCompleted');
    
    res.json(topScores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
