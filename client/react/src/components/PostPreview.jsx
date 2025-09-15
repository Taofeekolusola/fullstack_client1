import React from 'react';
import './PostPreview.css';

function PostPreview({ post, onClose, onPublish, onSaveDraft, isEditing = false }) {
  const handlePublish = () => {
    onPublish(post);
  };

  const handleSaveDraft = () => {
    onSaveDraft(post);
  };

  return (
    <div className="post-preview-overlay">
      <div className="post-preview-modal">
        <div className="preview-header">
          <h2>Post Preview</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="preview-content">
          <div className="preview-post">
            <h1 className="preview-title">{post.title}</h1>
            <div className="preview-meta">
              <span className="preview-author">By {post.username}</span>
              <span className="preview-date">
                {isEditing ? 'Last edited: ' + new Date().toLocaleDateString() : 'Publishing now'}
              </span>
            </div>
            <div className="preview-body">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="preview-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-secondary" onClick={handleSaveDraft}>
            Save as Draft
          </button>
          <button className="btn-primary" onClick={handlePublish}>
            {isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPreview;
