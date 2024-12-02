import React, { useState } from 'react';
import Pet from './components/Pet';
import MenuBar from './components/MenuBar';
import SubMenu from './components/SubMenu';
import PopupWindow from './components/PopupWindow';

const App = () => {
  const [activeMenu, setActiveMenu] = useState(null); // Currently active menu
  const [popupContent, setPopupContent] = useState(null); // Pop-up content
  const [petPosition, setPetPosition] = useState({
    x: window.innerWidth / 2 - 50, // Initial horizontal centering
    y: window.innerHeight / 2 - 50, // Initial vertical centering
  });
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 }); // submenu Position
  const [status, setStatus] = useState({
    Health: 80, // Initial Health
    Hunger: 50, // Initial Hunger
    Mood: 70, // Initial Mood
  });

  /**
   * Simulate API calls, which can be replaced with real backend interfaces in the future
   * @param {string} action - 执行的动作
   */
  const simulateApiCall = async (action) => {
    console.log(`Simulating API request for action: ${action}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          Health: Math.floor(Math.random() * 100),
          Hunger: Math.floor(Math.random() * 100),
          Mood: Math.floor(Math.random() * 100),
        });
      }, 1000); // Simulate 1 second delay
    });
  };

  /**
   * Menu option click processing
   * Switch animations based on options
   * @param {string} option - 选项名称
   */
  const handleOptionClick = async (option) => {
    if (activeMenu === 'Interact') {
      try {
        const updatedStatus = await simulateApiCall(option);
        setStatus(updatedStatus); // update status
        setPopupContent(`Successfully executed: ${option}`); // 
      } catch (error) {
        setPopupContent(`Error: Failed to execute ${option}`); // 
      }
    }
    setActiveMenu(null); // turn off menu
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? null : menu);
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  const updatePetPosition = (newPosition) => {
    setPetPosition(newPosition);
  };

  const updateSubMenuPosition = (position) => {
    setSubMenuPosition(position);
  };

  return (
    <div>
      {/* Pet Component */}
      <Pet position={petPosition} onPositionChange={updatePetPosition} />

      {/* Menu Bar */}
      <MenuBar
        position={petPosition}
        onMenuClick={handleMenuClick}
        onSubMenuPositionChange={updateSubMenuPosition}
      />

      {/* Sub Menu */}
      <SubMenu
        activeMenu={activeMenu}
        position={subMenuPosition}
        status={status}
        onOptionClick={handleOptionClick}
        onClose={handleMenuClose}
      />

      {/* Popup Window */}
      <PopupWindow title="Action" content={popupContent} onClose={closePopup} />
    </div>
  );
};

export default App;
