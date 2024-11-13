import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import '../App.css';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, refreshToken, setToken, setRefreshToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const response = await fetch('https://events-platform-cyfi.onrender.com/api/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setToken(data.accessToken);
                    localStorage.setItem('token', data.accessToken);
                    
                    if (data.refreshToken) {
                        setRefreshToken(data.refreshToken);
                    }
                    return data.accessToken;
                } else {
                    console.error('Failed to refresh token');
                    return null;
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                return null;
            }
        };
        
        const fetchUserEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                let newToken = token;

                if (!newToken) {
                    newToken = await refreshAccessToken();
                    if (!newToken) {
                        throw new Error('Unable to refresh token. Please log in again.');
                    }
                }

                const response = await fetch('https://events-platform-cyfi.onrender.com/api/events/userEvents', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const data = await response.json();
                const formattedEvents = data.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    start: new Date(event.start),
                    end: new Date(event.start),  
                }));
                setUserEvents(formattedEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserEvents();
    }, [token, refreshToken, setToken, setRefreshToken, refreshAccessToken]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ marginBottom: '10px' }}>Your Events Calendar</h2>
                <button onClick={() => navigate('/events')}>
                    Back to Events
                </button>
            </div>
            <Calendar events={userEvents} />
        </div>
    );
};

export default CalendarPage;
