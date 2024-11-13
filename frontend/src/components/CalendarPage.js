import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import '../App.css';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, refreshAccessToken } = useAuth();
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return expirationTime < Date.now();
    };

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                let currentToken = token;

                if (currentToken && isTokenExpired(currentToken)) {
                    currentToken = await refreshAccessToken();
                    if (!currentToken) {
                        throw new Error('Unable to refresh token. Please log in again.');
                    }
                    localStorage.setItem('token', currentToken); 
                } else if (!currentToken) {
                    currentToken = localStorage.getItem('token');
                }

                if (!currentToken) {
                    throw new Error('No valid token found. Please log in.');
                }

                const response = await fetch('https://events-platform-cyfi.onrender.com/api/events/userEvents', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
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
                    // allDay: true
                }));
                setUserEvents(formattedEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserEvents();
    }, [token, refreshAccessToken, navigate]);

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
