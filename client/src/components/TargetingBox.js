

// ===== client/src/components/TargetingBox.js =====
import React, { useEffect, useRef } from 'react';
import '../styles/TargetingBox.css';

const TargetingBox = ({ x, y, characters, onSelect, onClose }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const boxStyle = {
    position: 'fixed',
    left: x - 75,
    top: y - 75,
    zIndex: 1000
  };

  return (
    <div className="targeting-box" style={boxStyle} ref={boxRef}>
      <div className="targeting-circle"></div>
      <div className="character-dropdown">
        {characters.map(character => (
          <button
            key={character._id}
            className="character-option"
            onClick={() => onSelect(character.name)}
          >
            {character.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TargetingBox;
