import React, { useState } from 'react';
import Pet from './components/Pet';
import MenuBar from './components/MenuBar';
import SubMenu from './components/SubMenu';
import PopupWindow from './components/PopupWindow';

const App = () => {
  const useDummyData = true; // 用于控制是否使用模拟数据
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
  const [showNotification, setShowNotification] = useState(false); // 控制提示是否显示
  const [notificationMessage, setNotificationMessage] = useState(''); // 通知内容
  const [isTestMode, setIsTestMode] = useState(false); // 是否处于测试模式

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
    if (!isTestMode) {
      setPetPosition(newPosition);
    }
  };

const handleOptionClick = (option) => {
  console.log('Option clicked:', option); // 添加调试信息

  let actionMessage = '';
  if (useDummyData) {
    switch (option) {
      case 'Feed':
        setStatus((prevStatus) => {
          const newStatus = { ...prevStatus, Hunger: Math.min(prevStatus.Hunger + 10, 100) };
          actionMessage = `Hunger increased to ${newStatus.Hunger}%`;
          return newStatus;
        });
        break;
      case 'Play':
        setStatus((prevStatus) => {
          const newStatus = { ...prevStatus, Mood: Math.min(prevStatus.Mood + 10, 100) };
          actionMessage = `Mood increased to ${newStatus.Mood}%`;
          return newStatus;
        });
        break;
      case 'Pet':
        setStatus((prevStatus) => {
          const newStatus = { ...prevStatus, Health: Math.min(prevStatus.Health + 5, 100) };
          actionMessage = `Health increased to ${newStatus.Health}%`;
          return newStatus;
        });
        break;
      case 'Test Mode':
        if (isTestMode) {
          setIsTestMode(false);
          actionMessage = 'Pet is now out of Test Mode, movement resumed.';
        } else {
          setIsTestMode(true);
          actionMessage = 'Pet is now in Test Mode, movement stopped.';
        }
        break;
      case 'Reset Status':
        setStatus({
          Health: 0,
          Hunger: 0,
          Mood: 0,
        });
        actionMessage = 'Pet status has been reset to zero.';
        break;
      default:
        console.log(`Unknown option: ${option}`);
    }

    // 显示完成提示
    if (actionMessage) {
      console.log('Setting notification:', actionMessage); // 添加调试信息
      setNotificationMessage(actionMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // 2秒后隐藏通知
    }
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
        setNotificationMessage(data.message || 'Action completed');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
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
            onSubMenuPositionChange={setSubMenuPosition}
          />
        )}

        {/* Notification for interactions */}
        {showNotification && (
          <div
            style={{
              position: 'absolute',
              top: petPosition.y - 70, // 显示在宠物上方
              left: petPosition.x,
              transform: 'translate(-50%, 0)',
              background: 'rgba(0, 0, 0, 0.75)', // 使用透明黑色背景
              color: '#fff', // 白色文字
              padding: '10px 20px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              zIndex: 1000,
              fontSize: '14px',
              textAlign: 'center',
              width: 'max-content', // 根据内容自动调整宽度
            }}
          >
            {notificationMessage}
          </div>
        )}
      </div>

      {/* Sub Menu */}
      <SubMenu
        activeMenu={activeMenu}
        position={{ x: petPosition.x + 10, y: petPosition.y + 170 }} // 更新子菜单的位置
        status={status}
        onOptionClick={handleOptionClick}
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
