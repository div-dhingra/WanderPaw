import React from 'react';
import bike from '../assets/animation/doro-bike.gif';
import board from '../assets/animation/doro-board.gif';
import dorodash from '../assets/animation/doro-dorodash.gif';
import hunger from '../assets/animation/doro-hunger.gif';
import run from '../assets/animation/doro-run.gif';

/**
 * Pet Component
 * Displays the pet with animations based on its current action.
 */
const Pet = ({ action }) => {
  // Map actions to corresponding GIFs
  const getPetAnimation = () => {
    switch (action) {
      case 'bike':
        return bike;
      case 'board':
        return board;
      case 'dorodash':
        return dorodash;
      case 'hunger':
        return hunger;
      case 'run':
        return run;
      default:
        return dorodash; // Default animation
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
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
