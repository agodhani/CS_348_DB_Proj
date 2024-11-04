// src/components/HouseList.js
import React, { useEffect, useState } from 'react';
import './HouseList.css';

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
                console.log('Fetched houses:', data);
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

    if (houses.length === 0) {
        return <p>No houses available.</p>;
    }

    return (
        <div>
            <h2>House List</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>Zipcode</th>
                        <th>Price</th>
                        <th>Bedrooms</th>
                        <th>Bathrooms</th>
                        <th>Square Footage</th>
                        <th>Year Built</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {houses.map(house => (
                        <tr key={house.id}>
                            <td>{house.id}</td>
                            <td>{house.owner}</td>
                            <td>{house.status}</td>
                            <td>{house.street}</td>
                            <td>{house.city}</td>
                            <td>{house.zipcode}</td>
                            <td>${parseFloat(house.price).toLocaleString()}</td>
                            <td>{house.number_of_bedrooms}</td>
                            <td>{house.number_of_bathrooms}</td>
                            <td>{house.square_footage.toLocaleString()}</td>
                            <td>{house.year_built}</td>
                            <td>{new Date(house.updated_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HouseList;
