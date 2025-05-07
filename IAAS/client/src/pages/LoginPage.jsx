import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/login', { email, password });
            const user = response.data.user;
            onLogin(user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (user.role === 'student') navigate('/student-dashboard');
            else if (user.role === 'faculty') navigate('/faculty-dashboard');
            else if (user.role === 'admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
