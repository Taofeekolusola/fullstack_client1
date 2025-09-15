import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import './Dashboard.css';

function Dashboard() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <div className="dashboard-page">
        <AnalyticsDashboard username={authState.username} />
      </div>
    </div>
  );
}

export default Dashboard;
