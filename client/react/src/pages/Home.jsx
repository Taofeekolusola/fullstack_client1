import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Home.css';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from './helpers/AuthContext';

function Home() {
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [likedPosts, setLikedPosts] = useState([]); // Track liked posts by current user
  const navigate = useNavigate(); // Navigation hook
  const { authState } = useContext(AuthContext);

  // Fetch posts and liked posts when the component mounts
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate('/login'); // Redirect to login if user is not authenticated
    } else {
      const fetchPosts = async () => {
        try {
          const { data: fetchedPosts } = await axios.get("https://fullstack-server-side.onrender.com/posts/get");

          const likeCountPromises = fetchedPosts.map((post) =>
            axios.get(`https://fullstack-server-side.onrender.com/likes/${post._id}`, {
              headers: { token: localStorage.getItem("token") },
            })
          );

          const likeCountResponses = await Promise.all(likeCountPromises);

          const updatedPosts = fetchedPosts.map((post, index) => ({
            ...post,
            likeCount: likeCountResponses[index]?.data?.likeCount || 0,
          }));
          setPosts(updatedPosts);

          const { data: likedPostsData } = await axios.get("https://fullstack-server-side.onrender.com/likes", {
            headers: { token: localStorage.getItem("token") },
          });
          setLikedPosts(likedPostsData.map((like) => like.postId));
        } catch (err) {
          console.error("Error fetching posts or like counts:", err);
        }
      };

      fetchPosts();
    }
  }, [authState.status]); // Dependency on authState.status

  const deletePost = async (postId) => {
    try {
      // Optimistically update the state
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      // Perform the API call
      const response = await axios.delete(`https://fullstack-server-side.onrender.com/posts/del/${postId}`, {
        headers: { token: localStorage.getItem("token") },
      });

      if (response.data.error) {
        // Revert state if deletion failed
        alert(response.data.error);
        setPosts((prevPosts) => [...prevPosts]);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  // Handle liking and unliking a post
  const likeAPost = async (postId) => {
    try {
      const response = await axios.post(
        "https://fullstack-server-side.onrender.com/likes",
        { postId },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      const { message } = response.data;

      // Update likedPosts state
      setLikedPosts((prevLikedPosts) =>
        message === "Post liked"
          ? [...prevLikedPosts, postId]
          : prevLikedPosts.filter((id) => id !== postId)
      );

      // Refetch like count for the specific post and update state
      const { data: likeCountData } = await axios.get(`https://fullstack-server-side.onrender.com/likes/${postId}`, {
        headers: { token: localStorage.getItem("token") },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likeCount: likeCountData.likeCount }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div className="container" key={post._id}>
            <div className="title">{post.title}</div>
            <div className="body" onClick={() => navigate(`post/${post._id}`)}>
              {post.content}
            </div>
            
            <div className="footer">
  {post.username === authState.username && (
    <button
      type="button"
      onClick={() => deletePost(post._id)}
      className="delete1"
    >
      X
    </button>
  )}
  {post.username}
  <div onClick={() => likeAPost(post._id)} className="like">
    {likedPosts.includes(post._id) ? <ThumbUpAltIcon /> : <ThumbDownAltIcon />}
  </div>
  <span>{post.likeCount}</span> {/* Display the like count */}
</div>

          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default Home;