// src/components/DeleteHouse.js
import React, { useState } from 'react';

function DeleteHouse() {
    const [houseId, setHouseId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!houseId) {
            setError('Please enter a house ID.');
            setSuccess(null);
            return;
        }

        try {
            // Include authentication token if required
            const token = localStorage.getItem('token');

            const response = await fetch(`http://127.0.0.1:8000/accounts/houses/${houseId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token if authentication is required
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

            {/* Display success message */}
            {success && <div className="success-message">{success}</div>}

            {/* Display error message */}
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
