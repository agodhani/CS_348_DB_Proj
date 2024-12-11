// src/components/LoginUser.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginUser = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the endpoint to match your urls.py
            const response = await axios.post('http://127.0.0.1:8000/accounts/login/', formData, { withCredentials: true });
            alert('Login successful!');

            // Extract user_id from the response data
            const { user_id } = response.data;
            
            // Pass user_id to onLoginSuccess if needed
            onLoginSuccess(user_id);

        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            alert('Invalid username or password. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginUser;
