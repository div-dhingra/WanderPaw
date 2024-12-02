import React, { useState } from 'react';
import Pet from './components/Pet';
import MenuBar from './components/MenuBar';
import SubMenu from './components/SubMenu';
import PopupWindow from './components/PopupWindow';

const App = () => {
  const [activeMenu, setActiveMenu] = useState(null); // 当前激活的菜单
  const [popupContent, setPopupContent] = useState(null); // 弹窗内容
  const [petPosition, setPetPosition] = useState({
    x: window.innerWidth / 2 - 50, // 宠物初始位置居中
    y: window.innerHeight / 2 - 50,
  });
  const [subMenuPosition, setSubMenuPosition] = useState({ x: 0, y: 0 }); // 子菜单位置

  // 点击主菜单按钮时触发
  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? null : menu); // 点击相同按钮关闭菜单
  };

  // 关闭菜单的逻辑
  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  // 点击子菜单选项时触发
  const handleOptionClick = (option) => {
    setPopupContent(`You selected: ${option}`);
    setActiveMenu(null); // 关闭子菜单
  };

  // 关闭弹窗的逻辑
  const closePopup = () => {
    setPopupContent(null);
  };

  // 更新宠物的位置
  const updatePetPosition = (newPosition) => {
    setPetPosition(newPosition);
  };

  // 更新子菜单的位置
  const updateSubMenuPosition = (position) => {
    setSubMenuPosition(position);
  };

  return (
    <div>
      {/* 宠物组件 */}
      <Pet position={petPosition} onPositionChange={updatePetPosition} />

      {/* 菜单栏 */}
      <MenuBar
        position={petPosition}
        onMenuClick={handleMenuClick}
        onSubMenuPositionChange={updateSubMenuPosition}
      />

      {/* 子菜单 */}
      <SubMenu
        activeMenu={activeMenu}
        position={subMenuPosition}
        onClose={handleMenuClose} // 传递关闭逻辑
      />

      {/* 弹窗 */}
      <PopupWindow
        title="Action"
        content={popupContent}
        onClose={closePopup} // 传递关闭逻辑
      />
    </div>
  );
};

export default App;
