import React, { useEffect, useState } from 'react';

function MyHouses() {
    const [houses, setHouses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Assume user_id is stored in localStorage after login
        const userId = localStorage.getItem('user_id');
        if (userId == null) {
            setError('Not logged in. Please log in first.');
            setLoading(false);
            return;
        }

        fetch(`http://127.0.0.1:8000/accounts/myhouses/`, {
            headers: {
              'Content-Type': 'application/json',
              // If needed, include a token or user_id in headers:
              // 'X-User-ID': userId
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch houses');
            }
            return response.json();
        })
        .then(data => {
            setHouses(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading your houses...</div>;
    if (error) return <div>Error: {error}</div>;
    if (houses.length === 0) return <p>You have no houses.</p>;

    return (
        <div>
            <h2>My Houses</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
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

export default MyHouses;
