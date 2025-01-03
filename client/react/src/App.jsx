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
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              <>
                <Link to="/createpost">Post</Link>
                  <Link to="/">Home</Link>
                  <Link to="/changepassword">Password</Link>
              </>
            )}
            {authState.status && (
              <div className="logout">
                <button onClick={logout}>Logout</button>
              </div>
            )}
            <h1 className="user">
              {authState.status && greet} {authState.username}
            </h1>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePosts />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/changepassword" element={<ChangePassword />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;