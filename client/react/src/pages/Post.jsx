import { useEffect, useState, useContext } from 'react';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Post.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './helpers/AuthContext';

function Post() {
    let { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);  // Renamed to comments
    const [commentText, setCommentText] = useState('');
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
          navigate("/login");
        } else {
          // Fetch data
          axios.get(`https://fullstack-server-side.onrender.com/posts/get/${id}`).then((res) => {
            setPost(res.data);
          });
      
          axios.get(`https://fullstack-server-side.onrender.com/comments/get/${id}`).then((res) => {
            setComments(res.data);
          });
        }
      }, [id, authState.status]); // Ensure this includes authState.status
      
    const onSubmit = () => {
        axios
            .post(
                "https://fullstack-server-side.onrender.com/comments/add",
                {
                    comment: commentText,
                    postId: id,
                },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            )
            .then((res) => {
                if (res.data.error) {
                    alert(res.data.error);
                } else {
                    // Use the response to get the full comment object (including _id)
                    const newComment = {
                        comment: commentText,
                        username: res.data.username,
                        _id: res.data._id, // Ensure _id is returned and added to the comment
                    };
                    setComments([...comments, newComment]); // Add the new comment with _id
                    setCommentText(''); // Clear the input field
                    
                    // Update post comment count
                    setPost(prevPost => ({
                        ...prevPost,
                        commentCount: (prevPost.commentCount || 0) + 1
                    }));
                }
            })
            .catch((error) => {
                console.error("Error adding comment:", error);
                alert("An error occurred while adding the comment.");
            });
    };

    const deleteComment = (commentId) => {
        // Ensure commentId is valid before attempting deletion
        if (!commentId) {
            console.error('No comment ID provided');
            return;
        }

        // Optimistically update the state before making the API call
        const updatedComments = comments.filter((comment) => comment._id !== commentId);
        setComments(updatedComments); // Update state immediately
        
        // Update post comment count
        setPost(prevPost => ({
            ...prevPost,
            commentCount: Math.max(0, (prevPost.commentCount || 0) - 1)
        }));

        axios
            .delete(`https://fullstack-server-side.onrender.com/comments/del/${commentId}`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    // If deletion failed, revert state to previous state
                    alert(res.data.error);
                    setComments(comments); // Revert to previous state
                }
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
                alert("An error occurred while deleting the comment.");
                // Revert to previous state if error occurs
                setComments(comments);
            });
    };

    const editPost = (option) => {
        if (option !== "body") {
            let newTitle = prompt("Enter a new Title");
            if (newTitle && newTitle.trim()) {
                axios
                    .put(
                        "https://fullstack-server-side.onrender.com/posts/update",
                        { title: newTitle, id: id },
                        {
                            headers: {
                                token: localStorage.getItem("token"),
                            },
                        }
                    )
                    .then((res) => {
                        if (res.data.error) {
                            alert(res.data.error);
                        } else {
                            // Update the post state with the new title
                            setPost((prev) => ({ ...prev, title: newTitle }));
                        }
                    })
                    .catch((error) => {
                        console.error("Error updating title:", error);
                        alert("An error occurred while updating the title.");
                    });
            }
        } else {
            let newPost = prompt("Enter a new Post");
            if (newPost && newPost.trim()) {
                axios
                    .put(
                        "https://fullstack-server-side.onrender.com/posts/update",
                        { content: newPost, id: id },
                        {
                            headers: {
                                token: localStorage.getItem("token"),
                            },
                        }
                    )
                    .then((res) => {
                        if (res.data.error) {
                            alert(res.data.error);
                        } else {
                            // Update the post state with the new content
                            setPost((prev) => ({ ...prev, content: newPost }));
                        }
                    })
                    .catch((error) => {
                        console.error("Error updating post content:", error);
                        alert("An error occurred while updating the post.");
                    });
            }
        }
    };
    
    return (
        <div className="page-container">
            <div className="post-detail-container">
                <div className="post-detail-card">
                    <div className="post-header">
                        <h1 
                            className="post-title"
                            onClick={() => {
                                if (authState.username === post.username) {
                                    editPost("title")
                                }
                            }}
                            style={{ cursor: authState.username === post.username ? 'pointer' : 'default' }}
                        >
                            {post.title}
                        </h1>
                        <div className="post-meta">
                            <span className="post-author">Posted by {post.username}</span>
                            <div className="post-stats">
                                <span className="view-count">👀 {post.viewCount || 0} views</span>
                                <span className="like-count">❤️ {post.likeCount || 0} likes</span>
                                <span className="comment-count">💬 {post.commentCount || comments.length} comments</span>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        className="post-content"
                        onClick={() => { 
                            if (authState.username === post.username) {
                                editPost("body")
                            } 
                        }}
                        style={{ cursor: authState.username === post.username ? 'pointer' : 'default' }}
                    >
                        {post.content}
                    </div>
                </div>

                <div className="comments-section">
                    <div className="comments-header">
                        <h2>Comments ({comments.length})</h2>
                    </div>
                    
                    <div className="add-comment-form">
                        <div className="comment-input-group">
                            <input
                                value={commentText}
                                type="text"
                                placeholder="Share your thoughts..."
                                onChange={(event) => setCommentText(event.target.value)}
                                className="comment-input"
                            />
                            <button 
                                onClick={onSubmit} 
                                type="submit" 
                                className="add-comment-btn"
                                disabled={!commentText.trim()}
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                    
                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <div className="no-comments">
                                <p>No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            comments.map((comment, key) => (
                                <div className="comment-item" key={key}>
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.username}</span>
                                        {authState.username === comment.username && (
                                            <button
                                                onClick={() => deleteComment(comment._id)}
                                                className="delete-comment-btn"
                                                title="Delete comment"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                    <div className="comment-content">
                                        {comment.comment}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;