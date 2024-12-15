import React from 'react';



const Profile = ({ user, onLogout }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        textAlign: 'center',
        width: '400px',
      }}
    >
      <img
        src={user.avatar}
        alt="User Avatar"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          marginBottom: '20px',
        }}
      />
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Joined: {user.joinDate}</p>
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
