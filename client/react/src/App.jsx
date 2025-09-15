import "./App.css";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePosts from "./pages/CreatePosts";
import Post from "./pages/Post";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthContext } from "./pages/helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import ChangePassword from './pages/ChangePassword'

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("https://fullstack-server-side.onrender.com/users/auth", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data._id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ username: "", id: 0, status: false });
  };

  const greet = "USER:";

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav>
            <div className="nav-container">
              <div className="nav-brand">
                <Link to="/" className="brand-link">Blog</Link>
              </div>
              
              <div className="nav-content">
                <div className="nav-links">
                  {!authState.status ? (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/signup">Sign Up</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/">Home</Link>
                      <Link to="/createpost">Create</Link>
                      <Link to="/changepassword">Settings</Link>
                    </>
                  )}
                </div>
                
                {authState.status && (
                  <div className="nav-user">
                    <span className="user-info">
                      <span className="user-greeting">Hi,</span>
                      <span className="username">{authState.username}</span>
                    </span>
                    <button onClick={logout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/createpost" element={<CreatePosts />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/changepassword" element={<ChangePassword />} />
            </Routes>
          </div>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;