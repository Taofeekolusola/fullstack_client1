import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnalyticsDashboard.css';

function AnalyticsDashboard({ username }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    fetchDashboard();
  }, [username, timeframe]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://fullstack-server-side.onrender.com/posts/dashboard/${username}?timeframe=${timeframe}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="analytics-dashboard">
        <div className="error">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <div className="timeframe-selector">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{dashboard.totalPosts}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👀</div>
          <div className="stat-content">
            <div className="stat-number">{dashboard.totalViews}</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <div className="stat-number">{dashboard.totalLikes}</div>
            <div className="stat-label">Total Likes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-number">{dashboard.totalComments}</div>
            <div className="stat-label">Total Comments</div>
          </div>
        </div>
      </div>

      {dashboard.mostPopularPost && (
        <div className="popular-post-section">
          <h3>Most Popular Post</h3>
          <div className="popular-post-card">
            <h4>{dashboard.mostPopularPost.title}</h4>
            <div className="popular-post-stats">
              <span>👀 {dashboard.mostPopularPost.viewCount} views</span>
              <span>❤️ {dashboard.mostPopularPost.likeCount} likes</span>
              <span>💬 {dashboard.mostPopularPost.commentCount} comments</span>
            </div>
          </div>
        </div>
      )}

      <div className="recent-posts-section">
        <h3>Recent Posts</h3>
        <div className="recent-posts-list">
          {dashboard.recentPosts.map((post) => (
            <div key={post._id} className="recent-post-item">
              <div className="recent-post-title">{post.title}</div>
              <div className="recent-post-stats">
                <span>👀 {post.viewCount}</span>
                <span>❤️ {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="activity-timeline-section">
        <h3>Recent Activity</h3>
        <div className="activity-timeline">
          {dashboard.activityTimeline.slice(0, 10).map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.action === 'view' && '👀'}
                {activity.action === 'like' && '❤️'}
                {activity.action === 'comment' && '💬'}
                {activity.action === 'edit' && '✏️'}
                {activity.action === 'create' && '📝'}
              </div>
              <div className="activity-content">
                <div className="activity-action">
                  {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                </div>
                <div className="activity-time">
                  {new Date(activity.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
