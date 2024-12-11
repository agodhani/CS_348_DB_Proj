// src/components/DeleteHouse.js
import React, { useState, useEffect } from 'react';

function DeleteHouse() {
    const [houseId, setHouseId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [houseData, setHouseData] = useState({
        owner: '',
        status: '',
        street: '',
        city: '',
        zipcode: '',
        price: '',
        number_of_bedrooms: '',
        number_of_bathrooms: '',
        square_footage: '',
        year_built: '',
    });

    // If houseId changes, fetch the corresponding house data
    useEffect(() => {
        const fetchHouseData = async () => {
            if (!houseId) return; // If no houseId, don't fetch
            try {
                const response = await fetch(`http://127.0.0.1:8000/accounts/houses/${houseId}/`);
                if (!response.ok) {
                    // If house not found or some error occurred
                    throw new Error('Failed to fetch house data. Make sure the house ID is correct.');
                }
                const data = await response.json();
                
                // Store the real owner from the data
                // The owner is likely an integer user_id from the backend
                setHouseData({
                    owner: data.owner.toString(), // Storing as string for consistency
                    status: data.status || '',
                    street: data.street || '',
                    city: data.city || '',
                    zipcode: data.zipcode || '',
                    price: data.price ? data.price.toString() : '',
                    number_of_bedrooms: data.number_of_bedrooms ? data.number_of_bedrooms.toString() : '',
                    number_of_bathrooms: data.number_of_bathrooms ? data.number_of_bathrooms.toString() : '',
                    square_footage: data.square_footage ? data.square_footage.toString() : '',
                    year_built: data.year_built ? data.year_built.toString() : '',
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching house data:', err);
                setError(err.message);
                setHouseData({
                    owner: '',
                    status: '',
                    street: '',
                    city: '',
                    zipcode: '',
                    price: '',
                    number_of_bedrooms: '',
                    number_of_bathrooms: '',
                    square_footage: '',
                    year_built: '',
                });
            }
        };

        fetchHouseData();
    }, [houseId]);

    const handleDelete = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('user_id');
        if (userId == null) {
            setError('No user is logged in. Please log in first.');
            setSuccess(null);
            return;
        }

        if (!houseId) {
            setError('Please enter a house ID.');
            setSuccess(null);
            return;
        }

        // Check if the currently logged-in user is the owner of the house
        // houseData.owner is a string, userId is a string, compare them directly or convert to int
        if (houseData.owner !== userId) {
            setError('You are not the owner of this house.');
            setSuccess(null);
            return;
        }

        try {
            // Include authentication token if required (depends on your backend logic)
            const token = localStorage.getItem('token');

            const response = await fetch(`http://127.0.0.1:8000/accounts/houses/${houseId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token if required by your backend
                },
            });

            if (response.status === 204) {
                setSuccess('House deleted successfully.');
                setError(null);
                setHouseId('');
            } else if (response.status === 404) {
                setError('House not found or you do not have permission to delete it.');
                setSuccess(null);
            } else if (response.status === 401) {
                setError('You must be logged in to delete a house.');
                setSuccess(null);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete house.');
            }
        } catch (err) {
            console.error('Error deleting house:', err);
            setError(err.message);
            setSuccess(null);
        }
    };

    return (
        <div className="delete-house-container">
            <h2>Delete a House</h2>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">Error: {error}</div>}

            <form onSubmit={handleDelete} className="delete-house-form">
                <div className="form-group">
                    <label htmlFor="houseId">House ID<span className="required">*</span>:</label>
                    <input
                        type="number"
                        id="houseId"
                        value={houseId}
                        onChange={(e) => setHouseId(e.target.value)}
                        required
                        min="1"
                        placeholder="Enter house ID to delete"
                    />
                </div>

                <button type="submit" className="delete-button">Delete House</button>
            </form>
        </div>
    );
}

export default DeleteHouse;
