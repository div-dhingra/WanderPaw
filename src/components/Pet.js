import React, { useState, useEffect } from 'react';

const Pet = ({ position, onPositionChange }) => {
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    const interval = setInterval(() => {
      const newX = currentPosition.x + Math.random() * 50 - 25;
      const newY = currentPosition.y + Math.random() * 50 - 25;
      const boundedX = Math.max(0, Math.min(window.innerWidth - 100, newX));
      const boundedY = Math.max(0, Math.min(window.innerHeight - 100, newY));
      const updatedPosition = { x: boundedX, y: boundedY };
      setCurrentPosition(updatedPosition);
      onPositionChange(updatedPosition); // 通知父组件
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPosition, onPositionChange]);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${currentPosition.y}px`,
        left: `${currentPosition.x}px`,
        transition: 'all 0.5s ease',
      }}
    >
      <img
        src="https://via.placeholder.com/100?text=Pet" // 替换成实际宠物图片路径
        alt="Pet"
        style={{
          width: '100px',
          height: '100px',
        }}
      />
    </div>
  );
};

export default Pet;
