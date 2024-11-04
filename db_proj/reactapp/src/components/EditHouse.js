// src/components/EditHouse.js
import React, { useState, useEffect } from 'react';
import './EditHouse.css'; // Optional CSS file for styling

function EditHouse() {
    // State variables for form fields
    const [houses, setHouses] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState('');
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

    // State variables for handling feedback
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch the list of houses on component mount
    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/accounts/houses/');
                if (!response.ok) {
                    throw new Error('Failed to fetch houses.');
                }
                const data = await response.json();
                setHouses(data);
            } catch (err) {
                console.error('Error fetching houses:', err);
                setError(err.message);
            }
        };
        fetchHouses();
    }, []);

    // Fetch the selected house data when selectedHouseId changes
    useEffect(() => {
        if (selectedHouseId) {
            const fetchHouseData = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/accounts/houses/${selectedHouseId}/`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch house data.');
                    }
                    const data = await response.json();
                    setHouseData({
                        owner: data.owner || '',
                        status: data.status || '',
                        street: data.street || '',
                        city: data.city || '',
                        zipcode: data.zipcode || '',
                        price: data.price || '',
                        number_of_bedrooms: data.number_of_bedrooms || '',
                        number_of_bathrooms: data.number_of_bathrooms || '',
                        square_footage: data.square_footage || '',
                        year_built: data.year_built || '',
                    });
                    setError(null);
                } catch (err) {
                    console.error('Error fetching house data:', err);
                    setError(err.message);
                }
            };
            fetchHouseData();
        }
    }, [selectedHouseId]);

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Optional: Validate form data before sending
        if (
            !houseData.owner ||
            !houseData.status ||
            !houseData.street ||
            !houseData.city ||
            !houseData.zipcode ||
            isNaN(parseFloat(houseData.price)) ||
            isNaN(parseInt(houseData.number_of_bedrooms)) ||
            isNaN(parseFloat(houseData.number_of_bathrooms)) ||
            isNaN(parseInt(houseData.square_footage)) ||
            isNaN(parseInt(houseData.year_built))
        ) {
            setError('Please fill in all required fields correctly.');
            setSuccess(false);
            return;
        }

        try {
            // Send POST request to the backend API to update the house
            const response = await fetch(`http://127.0.0.1:8000/accounts/houses/${selectedHouseId}/`, {
                method: 'PUT', // Use PUT for updates
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(houseData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                const errorMessage = errorData.detail || JSON.stringify(errorData);
                throw new Error(errorMessage || 'Failed to update house.');
            }

            // If successful, parse the response data
            const data = await response.json();

            // Update state to reflect success
            setSuccess(true);
            setError(null);

            // Optionally, refresh the house list or perform other actions

        } catch (err) {
            // Handle errors by updating the error state
            console.error('Error updating house:', err);
            setError(err.message);
            setSuccess(false);
        }
    };

    // Handler for input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHouseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="edit-house-container">
            <h2>Edit a House</h2>

            {/* Display error message */}
            {error && <div className="error-message">Error: {error}</div>}

            {/* Display success message */}
            {success && <div className="success-message">House updated successfully!</div>}

            {/* Dropdown to select house */}
            <div className="form-group">
                <label htmlFor="selectedHouseId">Select a house to edit:</label>
                <select
                    id="selectedHouseId"
                    value={selectedHouseId}
                    onChange={(e) => setSelectedHouseId(e.target.value)}
                >
                    <option value="">-- Select a House --</option>
                    {houses.map((house) => (
                        <option key={house.id} value={house.id}>
                            {house.street}, {house.city} (ID: {house.id})
                        </option>
                    ))}
                </select>
            </div>

            {/* Display the form only if a house is selected */}
            {selectedHouseId && (
                <form onSubmit={handleSubmit} className="edit-house-form">
                    <div className="form-group">
                        <label htmlFor="owner">Owner<span className="required">*</span>:</label>
                        <input
                            type="text"
                            id="owner"
                            name="owner"
                            value={houseData.owner}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter owner name"
                        />
                    </div>

                    {/* Repeat similar input fields for other house attributes */}
                    <div className="form-group">
                        <label htmlFor="status">Status<span className="required">*</span>:</label>
                        <input
                            type="text"
                            id="status"
                            name="status"
                            value={houseData.status}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter house status"
                        />
                    </div>

                    {/* Continue for street, city, zipcode, price, etc. */}
                    <div className="form-group">
                        <label htmlFor="street">Street<span className="required">*</span>:</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={houseData.street}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter street address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City<span className="required">*</span>:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={houseData.city}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter city"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="zipcode">Zipcode<span className="required">*</span>:</label>
                        <input
                            type="text"
                            id="zipcode"
                            name="zipcode"
                            value={houseData.zipcode}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter zipcode"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price ($)<span className="required">*</span>:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={houseData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="Enter house price"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="number_of_bedrooms">Number of Bedrooms<span className="required">*</span>:</label>
                        <input
                            type="number"
                            id="number_of_bedrooms"
                            name="number_of_bedrooms"
                            value={houseData.number_of_bedrooms}
                            onChange={handleInputChange}
                            required
                            min="0"
                            placeholder="Enter number of bedrooms"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="number_of_bathrooms">Number of Bathrooms<span className="required">*</span>:</label>
                        <input
                            type="number"
                            id="number_of_bathrooms"
                            name="number_of_bathrooms"
                            value={houseData.number_of_bathrooms}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.5"
                            placeholder="Enter number of bathrooms"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="square_footage">Square Footage<span className="required">*</span>:</label>
                        <input
                            type="number"
                            id="square_footage"
                            name="square_footage"
                            value={houseData.square_footage}
                            onChange={handleInputChange}
                            required
                            min="0"
                            placeholder="Enter square footage"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="year_built">Year Built<span className="required">*</span>:</label>
                        <input
                            type="number"
                            id="year_built"
                            name="year_built"
                            value={houseData.year_built}
                            onChange={handleInputChange}
                            required
                            min="1800"
                            max={new Date().getFullYear()}
                            placeholder="Enter year built"
                        />
                    </div>

                    <button type="submit" className="submit-button">Update House</button>
                </form>
            )}
        </div>
    );
}

export default EditHouse;
