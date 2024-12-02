import React, { useState } from 'react';
import Pet from './components/Pet';
import MenuBar from './components/MenuBar';
import SubMenu from './components/SubMenu';
import PopupWindow from './components/PopupWindow';

const App = () => {
  const useDummyData = true; // Set to false to use the API when it's ready
  const [activeMenu, setActiveMenu] = useState(null);
  const [popupContent, setPopupContent] = useState(null);
  const [petPosition, setPetPosition] = useState({
    x: window.innerWidth / 2 - 50,
    y: window.innerHeight / 2 - 50,
  });
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState({
    Health: 80,
    Hunger: 50,
    Mood: 70,
  });
  const [petAction, setPetAction] = useState('dorodash');
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Track whether the menu is visible
  const [isSubMenuHovered, setIsSubMenuHovered] = useState(false); // Track whether the submenu is being hovered
  
  const handleOptionClick = (option) => {
  if (useDummyData) {
    console.log(`Selected: ${option}`);
  } else {
    // Future API call
    fetch('https://dummyapi.com/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: option }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
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
      <div
        onMouseEnter={() => setIsMenuVisible(true)} // Show menu when mouse enters pet area
        onMouseLeave={() => {
          if (!isSubMenuHovered) {
            setIsMenuVisible(false); // Hide menu only if submenu is not being hovered
          }
        }}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        {/* Pet Component */}
        <Pet position={petPosition} onPositionChange={updatePetPosition} action={petAction} />

        {/* Menu Bar - only visible when mouse is over the pet */}
        {isMenuVisible && (
          <MenuBar
            petPosition={petPosition}
            onMenuClick={handleMenuClick}
            onSubMenuPositionChange={updateSubMenuPosition}
          />
        )}
      </div>

      <SubMenu
      activeMenu={activeMenu}
  position={{ x: petPosition.x + 10, y: petPosition.y + 10 }} // 更新子菜单的位置
  status={status}
  onOptionClick={(option) => console.log(`Selected: ${option}`)}
  onClose={handleMenuClose}
  onMouseEnter={() => setIsSubMenuHovered(true)} // Mark submenu as hovered
  onMouseLeave={() => setIsSubMenuHovered(false)} // Mark submenu as not hovered
/>


      {/* Popup Window */}
      <PopupWindow title="Action" content={popupContent} onClose={closePopup} />
    </div>
  );
};

export default App;
