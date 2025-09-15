import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';
import UserPosts from '../components/UserPosts';
import './UserProfile.css';

function UserProfile() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate('/login');
    }
  }, [authState.status, navigate]);

  if (!authState.status) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="user-profile-page">
        <UserPosts />
      </div>
    </div>
  );
}

export default UserProfile;
