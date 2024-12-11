import React, { useState } from 'react';
import './AddHouse.css';

function AddHouse() {
    // Remove owner from state since we will not ask the user to enter it:
    const [owner, setOwner] = useState('');

    const [status, setStatus] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [price, setPrice] = useState('');
    const [numberOfBedrooms, setNumberOfBedrooms] = useState('');
    const [numberOfBathrooms, setNumberOfBathrooms] = useState('');
    const [squareFootage, setSquareFootage] = useState('');
    const [yearBuilt, setYearBuilt] = useState('');

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user_id from localStorage
        const userId = localStorage.getItem('user_id');
        if (userId == null) {
            setError('No user is logged in. Please log in first.');
            setSuccess(false);
            return;
        }
        setOwner(userId)

        // Construct the house data object, now including the owner as userId (int)
        const houseData = {
            owner: parseInt(userId, 10),
            status: status.trim(),
            street: street.trim(),
            city: city.trim(),
            zipcode: zipcode.trim(),
            price: parseFloat(price),
            number_of_bedrooms: parseInt(numberOfBedrooms, 10),
            number_of_bathrooms: parseFloat(numberOfBathrooms),
            square_footage: parseInt(squareFootage, 10),
            year_built: parseInt(yearBuilt, 10),
        };

        // Validate form data before sending
        if (
            isNaN(houseData.owner) ||
            !houseData.status ||
            !houseData.street ||
            !houseData.city ||
            !houseData.zipcode ||
            isNaN(houseData.price) ||
            isNaN(houseData.number_of_bedrooms) ||
            isNaN(houseData.number_of_bathrooms) ||
            isNaN(houseData.square_footage) ||
            isNaN(houseData.year_built)
        ) {
            setError('Please fill in all required fields correctly.');
            setSuccess(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/accounts/houses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(houseData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                const errorMessage = errorData.detail || JSON.stringify(errorData);
                throw new Error(errorMessage || 'Failed to add house.');
            }

            const data = await response.json();
            setSuccess(true);
            setError(null);

            // Clear form fields
            // We no longer had an owner field to clear
            setStatus('');
            setStreet('');
            setCity('');
            setZipcode('');
            setPrice('');
            setNumberOfBedrooms('');
            setNumberOfBathrooms('');
            setSquareFootage('');
            setYearBuilt('');

        } catch (err) {
            console.error('Error adding house:', err);
            setError(err.message);
            setSuccess(false);
        }
    };

    return (
        <div className="add-house-container">
            <h2>Add a New House</h2>
            {success && <div className="success-message">House added successfully!</div>}
            {error && <div className="error-message">Error: {error}</div>}

            <form onSubmit={handleSubmit} className="add-house-form">
                {/* Remove owner input field since we set it automatically */}
                
                <div className="form-group">
                    <label htmlFor="status">Status<span className="required">*</span>:</label>
                    <input
                        type="text"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        placeholder="Enter house status"
                    />
                </div>

                {/* The rest remain the same */}
                <div className="form-group">
                    <label htmlFor="street">Street<span className="required">*</span>:</label>
                    <input
                        type="text"
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                        placeholder="Enter street address"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city">City<span className="required">*</span>:</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Enter city"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="zipcode">Zipcode<span className="required">*</span>:</label>
                    <input
                        type="text"
                        id="zipcode"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        required
                        placeholder="Enter zipcode"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price ($)<span className="required">*</span>:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter house price"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="numberOfBedrooms">Number of Bedrooms<span className="required">*</span>:</label>
                    <input
                        type="number"
                        id="numberOfBedrooms"
                        value={numberOfBedrooms}
                        onChange={(e) => setNumberOfBedrooms(e.target.value)}
                        required
                        min="0"
                        placeholder="Enter number of bedrooms"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="numberOfBathrooms">Number of Bathrooms<span className="required">*</span>:</label>
                    <input
                        type="number"
                        id="numberOfBathrooms"
                        value={numberOfBathrooms}
                        onChange={(e) => setNumberOfBathrooms(e.target.value)}
                        required
                        min="0"
                        step="0.5"
                        placeholder="Enter number of bathrooms"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="squareFootage">Square Footage<span className="required">*</span>:</label>
                    <input
                        type="number"
                        id="squareFootage"
                        value={squareFootage}
                        onChange={(e) => setSquareFootage(e.target.value)}
                        required
                        min="0"
                        placeholder="Enter square footage"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="yearBuilt">Year Built<span className="required">*</span>:</label>
                    <input
                        type="number"
                        id="yearBuilt"
                        value={yearBuilt}
                        onChange={(e) => setYearBuilt(e.target.value)}
                        required
                        min="1800"
                        max={new Date().getFullYear()}
                        placeholder="Enter year built"
                    />
                </div>

                <button type="submit" className="submit-button">Add House</button>
            </form>
        </div>
    );
}

export default AddHouse;
