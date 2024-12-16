import React, { useState } from 'react';
import './Login.css';


const Login = ({ setIsLoggedIn, username, setUsername }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [password, setPassword] = useState('');

  // Send API-request to validate user log-in request / create new user-account && log them in simultaneously
  const handleUserProcessing = async (loginOrRegister) => {

    // Non-null values
    if (username && password) {

      //simulating login/signup success
      const requestBody = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
          "user_name": username, 
          "password": password
        })
      }
  
      try {
        let url = ""
        if (loginOrRegister == "login") {
          url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`
          console.log(true);

        } else if (loginOrRegister == "register") {
          url = `${process.env.REACT_APP_BACKEND_URL}/api/users`
        }

        const response = await fetch(url, requestBody);
        console.log(response)

        const res = await response.json();
        // If not 200-response-code
        if (!response.ok) { 
            throw new Error(`${res.error}`)
        } 
        
        // Successfully (created and) logged in user !!
        console.log(res.message);
        setIsLoggedIn(true);
        alert(res.message);
  
      } catch(error) {
        console.error(error)
        alert(error)
      };
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button style={buttonStyle} onClick={() => handleUserProcessing("login")}>
              Login
            </button>
            <div style={linkContainerStyle}>
              <button style={linkStyle} onClick={() => setCurrentPage('register')}>
                Register
              </button>
              <button style={linkStyle} onClick={() => setCurrentPage('forgotPassword')}>
                Forgot Password
              </button>
            </div>
          </div>
        );
      case 'register':
        return (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Register</h2>
            <input type="text" placeholder="Username" style={inputStyle} vale={username}  onChange={(e) => setUsername(e.target.value)} />
            {/* <input type="email" placeholder="Email" style={inputStyle} /> */}
            <input type="password" placeholder="Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* <input type="password" placeholder="Confirm Password" style={inputStyle} /> */}
            <button style={buttonStyle} onClick={() => {handleUserProcessing("register");}}>
              Register
            </button>
            <button style={linkStyle} onClick={() => setCurrentPage('login')}>
              Back to Login
            </button>
          </div>
        );
      case 'forgotPassword':
        return (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Forgot Password</h2>
            <input type="email" placeholder="Enter your email" style={inputStyle} />
            <button style={buttonStyle} onClick={() => alert('Password reset link sent!')}>
              Send Reset Link
            </button>
            <button style={linkStyle} onClick={() => setCurrentPage('login')}>
              Back to Login
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const inputStyle = {
    width: '93%',
    padding: '10px',
    marginBottom: '20px',
    border: '2px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  };

  const linkStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
  };

  const linkContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
      ></div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          width: '400px',
          textAlign: 'center',
        }}
      >
        <button

          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            color: '#333',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>

        {renderPage()}
      </div>
    </div>
  );
};

export default Login;
