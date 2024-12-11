// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId || userId === 'null') {
            // If no user is logged in, just redirect to login
            navigate('/login');
            return;
        }

        const doLogout = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/accounts/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: parseInt(userId, 10) }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Logout error:', errorData);
                    // Even if there's an error, we clear local storage so user can attempt login again
                }
            } catch (err) {
                console.error('Logout request failed:', err);
            }

            // Clear user_id and redirect to login
            localStorage.removeItem('user_id');
            navigate('/login');
        };

        doLogout();
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
}

export default Logout;
