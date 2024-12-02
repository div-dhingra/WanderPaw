import React, { useEffect, useState } from 'react';
import bike from '../assets/animation/doro-bike.gif';
import board from '../assets/animation/doro-board.gif';
import dorodash from '../assets/animation/doro-dorodash.gif';
import hunger from '../assets/animation/doro-hunger.gif';
import move from '../assets/animation/doro-move.gif';
import run from '../assets/animation/doro-run.gif';
import sleep from '../assets/animation/doro-sleep.gif';
import idle from '../assets/animation/doro-idle.gif';

/**
 * Pet Component
 * Displays the pet with animations based on its current action.
 */
const Pet = ({ action, position, onPositionChange }) => {
  const [currentAction, setCurrentAction] = useState(action);

  // Map actions to corresponding GIFs
  const getPetAnimation = () => {
    switch (currentAction) {
      case 'bike':
        return bike;
      case 'board':
        return board;
      case 'dorodash':
        return dorodash;
      case 'hunger':
        return hunger;
      case 'move':
        return move;
      case 'run':
        return run;
      case 'sleep':
        return sleep;
      case 'idle':
      default:
        return idle; // Default to idle
    }
  };

  // Randomly move the pet on the screen
  const movePetRandomly = () => {
    if (currentAction !== 'idle' && currentAction !== 'sleep') {
      const offsetX = Math.random() * 300 - 150; // Random offset between -150 and 150
      const offsetY = Math.random() * 300 - 150; // Random offset between -150 and 150

      const newX = Math.max(0, Math.min(window.innerWidth - 200, position.x + offsetX));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, position.y + offsetY));

      onPositionChange({ x: newX, y: newY });
    }
  };

  // Randomly switch actions from a pool
  const randomizeAction = () => {
    const actions = ['bike', 'board', 'dorodash', 'hunger', 'move', 'run', 'idle', 'sleep'];
    const newAction = actions[Math.floor(Math.random() * actions.length)];
    setCurrentAction(newAction);
  };

  useEffect(() => {
    const actionInterval = setInterval(randomizeAction, 5000); // Switch action every 5 seconds
    const moveInterval = setInterval(movePetRandomly, 1000); // Move pet every 1 seconds

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
    >
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
