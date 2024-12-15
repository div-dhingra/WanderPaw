import React, { useState } from 'react';

const Login = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState('login'); // 控制當前顯示的頁面

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button onClick={() => alert('Logged in!')}>Login</button>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => setCurrentPage('register')}>Register</button>
              <button onClick={() => setCurrentPage('forgotPassword')}>Forgot Password</button>
            </div>
          </div>
        );
      case 'register':
        return (
          <div>
            <h2>Register</h2>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button onClick={() => alert('Registered!')}>Register</button>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => setCurrentPage('login')}>Back to Login</button>
            </div>
          </div>
        );
      case 'forgotPassword':
        return (
          <div>
            <h2>Forgot Password</h2>
            <input type="email" placeholder="Enter your email" />
            <button onClick={() => alert('Password reset link sent!')}>Send Reset Link</button>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => setCurrentPage('login')}>Back to Login</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '300px',
        textAlign: 'center',
      }}
    >
      {renderPage()}
      <button
        onClick={onClose}
        style={{
          marginTop: '15px',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Login;
