import React, { useState } from 'react';
import Pet from './components/Pet';
import MenuBar from './components/MenuBar';
import SubMenu from './components/SubMenu';
import PopupWindow from './components/PopupWindow';

const App = () => {
  const [activeMenu, setActiveMenu] = useState(null); // 当前激活的菜单
  const [popupContent, setPopupContent] = useState(null); // 弹窗内容
  const [petPosition, setPetPosition] = useState({
    x: window.innerWidth / 2 - 50, // 初始水平居中
    y: window.innerHeight / 2 - 50, // 初始垂直居中
  });
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 }); // 子菜单位置
  const [status, setStatus] = useState({
    Health: 80, // 初始健康值
    Hunger: 50, // 初始饥饿值
    Mood: 70, // 初始心情值
  });

  /**
   * 模拟 API 调用，未来可替换为真实后端接口
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
      }, 1000); // 模拟 1 秒延迟
    });
  };

  /**
   * 菜单选项点击处理
   * 根据选项切换动画
   * @param {string} option - 选项名称
   */
  const handleOptionClick = async (option) => {
    if (activeMenu === 'Interact') {
      try {
        const updatedStatus = await simulateApiCall(option);
        setStatus(updatedStatus); // 更新状态
        setPopupContent(`Successfully executed: ${option}`); // 显示成功消息
      } catch (error) {
        setPopupContent(`Error: Failed to execute ${option}`); // 显示错误消息
      }
    }
    setActiveMenu(null); // 关闭菜单
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
