import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PopularPosts.css';

function PopularPosts() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');
  const [popularityFilter, setPopularityFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularPosts();
  }, [timeframe, popularityFilter]);

  const fetchPopularPosts = async () => {
    try {
      setLoading(true);
      let url = `https://fullstack-server-side.onrender.com/posts/get?status=published&sortBy=viewCount&sortOrder=desc&limit=6`;
      
      // Add popularity filter
      if (popularityFilter === 'popular') {
        url += '&popularity=popular';
      } else if (popularityFilter === 'trending') {
        url += '&popularity=trending';
      }
      
      // Add timeframe filter
      if (timeframe !== 'all') {
        url += `&timeframe=${timeframe}`;
      }
      
      const response = await axios.get(url);
      setPopularPosts(response.data);
    } catch (error) {
      console.error('Error fetching popular posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="popular-posts">
        <div className="loading">Loading popular posts...</div>
      </div>
    );
  }

  return (
    <div className="popular-posts">
      <div className="popular-posts-header">
        <h2>🔥 Popular Posts</h2>
        <div className="filters-container">
          <div className="filter-group">
            <label>Popularity:</label>
            <select 
              value={popularityFilter} 
              onChange={(e) => setPopularityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Posts</option>
              <option value="popular">Popular (3+ likes)</option>
              <option value="trending">Trending (10+ likes)</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Timeframe:</label>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {popularPosts.length === 0 ? (
        <div className="no-posts">
          <p>No popular posts found for the selected timeframe.</p>
        </div>
      ) : (
        <div className="popular-posts-grid">
          {popularPosts.map((post, index) => (
            <div 
              key={post._id} 
              className={`popular-post-card ${index < 3 ? 'featured' : ''}`}
              onClick={() => handlePostClick(post._id)}
            >
              {index < 3 && (
                <div className="rank-badge">
                  #{index + 1}
                </div>
              )}
              
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-preview">
                  {post.content.length > 100 
                    ? post.content.substring(0, 100) + '...' 
                    : post.content
                  }
                </p>
                
                <div className="post-meta">
                  <span 
                    className="post-author clickable"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${post.username}`);
                    }}
                    title={`View posts by ${post.username}`}
                  >
                    by {post.username}
                  </span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="post-stats">
                <div className="stat">
                  <span className="stat-icon">👀</span>
                  <span className="stat-value">{post.viewCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">❤️</span>
                  <span className="stat-value">{post.likeCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💬</span>
                  <span className="stat-value">{post.commentCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PopularPosts;
