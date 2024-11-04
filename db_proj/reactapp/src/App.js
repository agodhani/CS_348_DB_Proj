// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import LoginUser from './components/LoginUser';
import HouseList from './components/HouseList';
import AddHouse from './components/AddHouse';
import './App.css'; // Optional: Import global CSS

function App() {
    const handleLoginSuccess = () => {
        console.log("User successfully logged in");
        // Additional actions upon successful login, like redirecting
    };

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/houses">View Houses</Link>
                        </li>
                        <li>
                            <Link to="/add-house">Add House</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<RegisterUser />} />
                    <Route path="/login" element={<LoginUser onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/houses" element={<HouseList />} />
                    <Route path="/add-house" element={<AddHouse />} />
                    {/* Add a default route or 404 page as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
