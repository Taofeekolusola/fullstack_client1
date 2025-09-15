import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UserPosts.css';

function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [popularityFilter, setPopularityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();

  useEffect(() => {
    if (urlUsername) {
      setUsername(urlUsername);
      fetchUserPosts(urlUsername);
    }
  }, [urlUsername, popularityFilter, sortBy]);

  const fetchUserPosts = async (targetUsername) => {
    try {
      setLoading(true);
      let url = `https://fullstack-server-side.onrender.com/posts/user/${targetUsername}?status=published&sortBy=${sortBy}&sortOrder=desc&limit=20`;
      
      // Add popularity filter
      if (popularityFilter === 'popular') {
        url += '&popularity=popular';
      } else if (popularityFilter === 'trending') {
        url += '&popularity=trending';
      }
      
      const response = await axios.get(url);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="user-posts">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="user-posts">
      <div className="user-posts-header">
        <h2>📝 Posts by {username}</h2>
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
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="createdAt">Date</option>
              <option value="viewCount">Views</option>
              <option value="likeCount">Likes</option>
              <option value="commentCount">Comments</option>
            </select>
          </div>
        </div>
      </div>

      {userPosts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found for {username} with the selected filters.</p>
        </div>
      ) : (
        <div className="user-posts-grid">
          {userPosts.map((post) => (
            <div 
              key={post._id} 
              className="user-post-card"
              onClick={() => handlePostClick(post._id)}
            >
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-preview">
                  {post.content.length > 150 
                    ? post.content.substring(0, 150) + '...' 
                    : post.content
                  }
                </p>
                
                <div className="post-meta">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="post-stats">
                <div className="stat">
                  <span className="stat-icon">👀</span>
                  <span className="stat-value">{post.viewCount || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">❤️</span>
                  <span className="stat-value">{post.likeCount || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💬</span>
                  <span className="stat-value">{post.commentCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserPosts;
