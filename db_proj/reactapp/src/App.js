// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import LoginUser from './components/LoginUser';
import HouseList from './components/HouseList';
import AddHouse from './components/AddHouse';
import EditHouse from './components/EditHouse';
import DeleteHouse from './components/DeleteHouse';
import MyHouses from './components/MyHouses';
import Logout from './components/Logout'; // Import the new Logout component
import './App.css';

function App() {
    const handleLoginSuccess = (user_id) => {
        console.log("User successfully logged in, user_id:", user_id);
        localStorage.setItem('user_id', user_id);
    };

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/houses">View Houses</Link></li>
                        <li><Link to="/myhouses">My Houses</Link></li>
                        <li><Link to="/add-house">Add House</Link></li>
                        <li><Link to="/edit-house">Edit House</Link></li>
                        <li><Link to="/delete-house">Delete Houses</Link></li>
                        <li><Link to="/logout">Log Out</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<RegisterUser />} />
                    <Route path="/login" element={<LoginUser onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/houses" element={<HouseList />} />
                    <Route path="/myhouses" element={<MyHouses />} />
                    <Route path="/add-house" element={<AddHouse />} />
                    <Route path="/edit-house" element={<EditHouse />} />
                    <Route path="/delete-house" element={<DeleteHouse />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
