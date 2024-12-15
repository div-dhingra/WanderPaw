import React from 'react';
import loginIcon from '../assets/icons/login-icon.png'; // 登入圖標

const LoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <img
        src={loginIcon}
        alt="Login Icon"
        style={{ width: '40px', height: '40px' }}
      />
    </button>
  );
};

export default LoginButton;
