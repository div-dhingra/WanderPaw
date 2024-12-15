import React from 'react';

/**
 * SubMenu Component
 * Handles rendering of dynamic menus (Status, Interact, Settings).
 * Accepts props for menu activation, position, and event handling.
 */
const SubMenu = ({ activeMenu, onOptionClick, onClose, position, status }) => {
  if (!activeMenu) return null; // Do not render if no menu is active

  // Menu options for Interact and Settings menus
 const options = {
  Interact: ['Feed', 'Play', 'Pet'], 
  Settings: ['Sound', 'Background', 'Idle Mode', 'Reset Status'],
};


  // Determines progress bar color based on status type
  const getColor = (key) => {
    switch (key) {
      case 'health':
        return 'green';
      case 'hunger':
        return 'orange';
      case 'mood':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translateX(-50%)',
        background: 'white',
        padding: '15px',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        width: '200px', // 增加宽度以适应更多选项
      }}
    >
      {/* Close button for the menu */}
      <button
        onClick={onClose} // Close menu when clicked
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'transparent',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        ✖
      </button>

      {/* Status menu rendering */}
      {activeMenu === 'Status' &&
        Object.entries(status).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <div
              style={{
                marginBottom: '5px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {key}: {key === "health" ? value : value[0]}%
            </div>
            <div
              style={{
                height: '10px',
                width: '100%',
                background: '#eee',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${key === "health" ? value : value[0]}%`,
                  background: getColor(key), // Set progress bar color
                  borderRadius: '5px',
                }}
              ></div>
            </div>
          </div>
        ))}

      {/* Interact and Settings menu rendering */}
      {activeMenu !== 'Status' &&
        options[activeMenu]?.map((option) => (
          <button
            key={option}
            onClick={() => onOptionClick(option)} // Calls parent function to handle API calls
            style={{
              display: 'block',
              margin: '5px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%', // 确保按钮占据菜单的宽度
            }}
          >
            {option}
          </button>
        ))}
    </div>
  );
};

export default SubMenu;
