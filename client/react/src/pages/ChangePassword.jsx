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
    <div>
      <h1>Change Your Password</h1>
      <input
        type="password"
        placeholder="Old Password"
        onChange={(e) => setOldPassword(e.target.value)}
        value={oldPassword}
      />
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
        value={newPassword}
      />
      <button onClick={changePassword} className='change'>Submit</button>
    </div>
  );
}

export default ChangePassword;