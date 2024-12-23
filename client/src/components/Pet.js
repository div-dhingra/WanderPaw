import React, { useEffect, useState } from 'react';
import bike from '../assets/animation/doro-bike.gif';
import board from '../assets/animation/doro-board.gif';
import dorodash from '../assets/animation/doro-dorodash.gif';
import hunger from '../assets/animation/doro-hunger.gif';
import move from '../assets/animation/doro-move.gif';
import run from '../assets/animation/doro-run.gif';
import sleep from '../assets/animation/doro-sleep.gif';
import idle from '../assets/animation/doro-idle.gif';

const Pet = ({ action, position, onPositionChange }) => {
  const [currentAction, setCurrentAction] = useState(action);
  const [isHovered, setIsHovered] = useState(false); // 控制滑鼠移入狀態
  // const [showLogin, setShowLogin] = useState(false); // 控制登入窗口顯示

  const getPetAnimation = () => {
    switch (currentAction) {
      case 'bike': return bike;
      case 'board': return board;
      case 'dorodash': return dorodash;
      case 'hunger': return hunger;
      case 'move': return move;
      case 'run': return run;
      case 'sleep': return sleep;
      case 'idle': 
      default: return idle;
    }
  };

  const movePetRandomly = () => {
    if (currentAction !== 'idle' && currentAction !== 'sleep' && currentAction !== 'hunger') {
      const offsetX = Math.random() * 300 - 150;
      const offsetY = Math.random() * 300 - 150;

      const newX = Math.max(0, Math.min(window.innerWidth - 200, position.x + offsetX));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, position.y + offsetY));

      onPositionChange({ x: newX, y: newY });
    }
  };

  useEffect(() => {
    const actionInterval = setInterval(() => {
      const actions = ['bike', 'board', 'dorodash', 'hunger', 'move', 'run', 'idle', 'sleep'];
      setCurrentAction(actions[Math.floor(Math.random() * actions.length)]);
    }, 5000);

    const moveInterval = setInterval(movePetRandomly, 1000);

    return () => {
      clearInterval(actionInterval);
      clearInterval(moveInterval);
    };
  }, [currentAction]);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
      }}
      onMouseEnter={() => setIsHovered(true)} // 滑鼠進入
      onMouseLeave={() => setIsHovered(false)} // 滑鼠離開
    >
      {/* 寵物動畫 */}
      <img
        src={getPetAnimation()}
        alt="Pet Animation"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default Pet;
