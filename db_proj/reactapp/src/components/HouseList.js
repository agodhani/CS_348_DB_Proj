// src/components/HouseList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HouseList() {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/accounts/houses/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setHouses(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching houses:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading houses...</div>;
    }

    if (error) {
        return <div>Error loading houses: {error.message}</div>;
    }

    return (
        <div>
            <h2>House List</h2>
            {houses.length === 0 ? (
                <p>No houses available.</p>
            ) : (
                <ul>
                    {houses.map(house => (
                        <li key={house.id}>
                            <h3>{house.title}</h3>
                            <p>{house.description}</p>
                            {/* Add more house details as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HouseList;
