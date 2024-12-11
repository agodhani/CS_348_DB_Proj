// src/components/HouseList.js
import React, { useEffect, useState } from 'react';
import './HouseList.css';

function HouseList() {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filtering
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');

    // Allowed filters correspond to backend allowed_filters
    const filterOptions = [
        { label: 'City', value: 'city' },
        { label: 'Zipcode', value: 'zipcode' },
        { label: 'Price', value: 'price' },
        { label: 'Bedrooms', value: 'bedrooms' },
        { label: 'Bathrooms', value: 'bathrooms' },
        { label: 'Square Footage', value: 'square_footage' },
        { label: 'Year Built', value: 'year_built' }
    ];

    const fetchHouses = () => {
        setLoading(true);
        setError(null);

        let url = 'http://127.0.0.1:8000/accounts/houses/';
        const params = [];
        if (filterField && filterValue) {
            params.push(`filter_field=${encodeURIComponent(filterField)}`);
            params.push(`filter_value=${encodeURIComponent(filterValue)}`);
        }
        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        fetch(url)
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
    };

    // Fetch houses initially without any filters
    useEffect(() => {
        fetchHouses();
    }, []);

    const handleFilterApply = (e) => {
        e.preventDefault();
        fetchHouses();
    };

    if (loading) {
        return <div>Loading houses...</div>;
    }

    if (error) {
        return <div>Error loading houses: {error.message}</div>;
    }

    if (houses.length === 0) {
        return (
            <div>
                <h2>House List</h2>
                <form onSubmit={handleFilterApply} className="filter-form">
                    <label>Filter Field:</label>
                    <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
                        <option value="">--No Filter--</option>
                        {filterOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <label>Filter Value:</label>
                    <input
                        type="text"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />

                    <button type="submit">Apply Filter</button>
                </form>
                <p>No houses available.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>House List</h2>

            <form onSubmit={handleFilterApply} className="filter-form">
                <label>Filter Field:</label>
                <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
                    <option value="">--No Filter--</option>
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <label>Filter Value:</label>
                <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />

                <button type="submit">Apply Filter</button>
            </form>

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
