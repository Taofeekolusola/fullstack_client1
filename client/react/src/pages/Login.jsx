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
        <div className="container1">
            <form className="form1" onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='login' type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;