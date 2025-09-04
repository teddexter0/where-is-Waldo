

// ===== client/src/components/Leaderboard.js =====
import React, { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

const Leaderboard = ({ onClose }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/scores/leaderboard');
      const data = await response.json();
      setScores(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="modal-overlay">
      <div className="leaderboard-modal">
        <div className="modal-header">
          <h2>🏆 Leaderboard</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="leaderboard-content">
          {loading ? (
            <p>Loading leaderboard...</p>
          ) : scores.length === 0 ? (
            <p>No scores yet. Be the first!</p>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={score._id} className={index < 3 ? `rank-${index + 1}` : ''}>
                    <td className="rank">{index + 1}</td>
                    <td className="player-name">{score.playerName}</td>
                    <td className="completion-time">{formatTime(score.completionTime)}</td>
                    <td className="date">{formatDate(score.dateCompleted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;