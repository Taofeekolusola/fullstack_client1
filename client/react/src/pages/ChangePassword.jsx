import React, { useState } from 'react';
import axios from 'axios';
import  './ChangePassword.css';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changePassword = async () => {
    try {
      const res = await axios.put(
        'https://fullstack-server-side.onrender.com/users/update',
        { oldPassword, newPassword },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        }
      );
      if (res.data.error) {
        alert(res.data.error);
      } else {
        alert('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred while updating the password.');
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Change Password</h1>
            <p>Update your account password</p>
          </div>
          <div className="auth-form">
            <div className="form-group">
              <label htmlFor="oldPassword">Current Password</label>
              <input
                id="oldPassword"
                type="password"
                placeholder="Enter your current password"
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>
            <button onClick={changePassword} className="auth-button">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;