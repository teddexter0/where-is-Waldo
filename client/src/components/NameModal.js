
// ===== client/src/components/NameModal.js =====
import React, { useState } from 'react';
import '../styles/NameModal.css';

const NameModal = ({ completionTime, onSubmit, onClose }) => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (playerName.trim().length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          playerName: playerName.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        onSubmit();
      } else {
        setError(result.error || 'Failed to submit score');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="name-modal">
        <div className="modal-header">
          <h2>🎉 Congratulations!</h2>
        </div>
        
        <div className="completion-info">
          <p>You found all the characters!</p>
          <div className="completion-time">
            Your time: <strong>{formatTime(completionTime)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="name-form">
          <div className="form-group">
            <label htmlFor="playerName">Enter your name for the leaderboard:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength="50"
              placeholder="Your name"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="skip-button"
              disabled={isSubmitting}
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NameModal;