import React from 'react';
import statusIcon from '../assets/icons/status-icon.svg';
import interactIcon from '../assets/icons/interact-icon.png';
import settingsIcon from '../assets/icons/settings-icon.png';

const MenuBar = ({ petPosition, onMenuClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${petPosition.y + 100}px`, 
        left: `${petPosition.x}px`,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        borderRadius: '8px', 
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', 
      }}
    >
      {/* Status Button */}
      <button onClick={() => onMenuClick('Status')}>
        <img src={statusIcon} alt="Status" style={{ width: '30px', height: '30px' }} />
      </button>

      {/* Interact Button */}
      <button onClick={() => onMenuClick('Interact')}>
        <img src={interactIcon} alt="Interact" style={{ width: '30px', height: '30px' }} />
      </button>

      {/* Settings Button */}
      <button onClick={() => onMenuClick('Settings')}>
        <img src={settingsIcon} alt="Settings" style={{ width: '30px', height: '30px' }} />
      </button>
    </div>
  );
};

export default MenuBar;
