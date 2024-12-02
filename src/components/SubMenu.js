import React from 'react';

const SubMenu = ({ activeMenu, onClose, position }) => {
  if (!activeMenu || activeMenu !== 'Status') return null;

  // 假数据：每种状态的当前值
  const status = {
    Health: 80,
    Hunger: 40,
    Mood: 90,
  };

  const getColor = (key) => {
    switch (key) {
      case 'Health':
        return 'green';
      case 'Hunger':
        return 'orange';
      case 'Mood':
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
        width: '180px',
      }}
    >
      {/* 添加关闭按钮 */}
      <button
        onClick={onClose}
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
      {Object.entries(status).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '10px' }}>
          <div
            style={{
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            {key}: {value}%
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
                width: `${value}%`,
                background: getColor(key),
                borderRadius: '5px',
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubMenu;
