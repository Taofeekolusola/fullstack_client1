import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { AuthContext } from './helpers/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();
    const { setAuthState } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { username, password };
        axios
            .post('https://fullstack-server-side.onrender.com/users/login', data)
            .then((response) => {
                if (response.data.success) {
                    localStorage.setItem('token', response.data.token);
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true
                    });
                    navigate('/');
                } else {
                    alert(response.data.error);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="page-container">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button className="auth-button" type="submit">
                            Sign In
                        </button>
                    </form>
                    <div className="auth-footer">
                        <p>Don't have an account? <a href="/signup">Sign up</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;