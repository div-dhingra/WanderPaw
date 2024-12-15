import React, { useState } from 'react';
import Login from './Login'; // 
import loginIcon from '../assets/icons/login-icon.png'; // 

const LoginButton = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleLoginIconClick = () => {
        console.log("Login icon clicked!");
        setShowLogin(true); // popup
    };

    const closeLogin = () => {
        setShowLogin(false); // close
    };

    return (
        <>
            {/* icon */}
            <img
                src={loginIcon}
                alt="Login Icon"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '100px',
                    height: '100x',
                    cursor: 'pointer',
                    zIndex: 1000, 
                }}
                onClick={handleLoginIconClick}
            />
            {showLogin && <Login onClose={closeLogin} />}
        </>
    );
};

export default LoginButton;
