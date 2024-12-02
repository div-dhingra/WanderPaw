import React from 'react';

const MenuBar = ({ position, onMenuClick, onSubMenuPositionChange }) => {
  const menuItems = ['Status', 'Interact', 'Settings'];

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y + 120}px`, // 菜单显示在宠物下方
        left: `${position.x}px`,
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        gap: '15px',
        zIndex: 100,
      }}
    >
      {menuItems.map((item, index) => (
        <button
          key={item}
          onMouseEnter={(e) => {
            const rect = e.target.getBoundingClientRect();
            onSubMenuPositionChange({ x: rect.x + rect.width / 2, y: rect.y });
          }}
          onClick={() => onMenuClick(item)}
          style={{
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
