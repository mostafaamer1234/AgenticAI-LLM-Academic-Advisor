import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '@mui/material';

const AdminDashboard = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [sex, setSex] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }


        try {
            const response = await axios.post('http://localhost:5001/api/register', { name, email, password, role, sex, dateOfBirth });

            setSuccess(response.data.message);
            localStorage.setItem('token', response.data.token);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setDateOfBirth('');
            setSex('');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>
            <div className="form-section">
                <h3>Add New User</h3>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <select
                        required
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}>
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        placeholder="Date of Birth"
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type='submit'>Add User</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;