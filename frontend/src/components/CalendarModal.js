import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Calendar from 'react-calendar';
import '../App.css';
import { useAuth } from '../AuthProvider';

Modal.setAppElement('#root');

const CalendarModal = ({ isOpen, onClose }) => {
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, refreshAccessToken } = useAuth();

    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return expirationTime < Date.now();
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchUserEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                let currentToken = token;

                if (isTokenExpired(token)) {
                    currentToken = await refreshAccessToken();
                    if (!currentToken) {
                        alert('Session expired. Please log in again.');
                        onClose();
                        return;
                    }
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
                setUserEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserEvents();
    }, [isOpen, token, refreshAccessToken, onClose]);

    const formatEventsForCalendar = () => {
        return userEvents.map(event => ({
            date: new Date(event.start),
            title: event.title,
            description: event.description,
        }));
    };

    const renderEvents = ({ date }) => {
        const eventsOnDate = formatEventsForCalendar().filter(event =>
            date.toDateString() === event.date.toDateString()
        );

        return (
            <div>
                {eventsOnDate.map((event, index) => (
                    <div key={index}>
                        <strong>{event.title}</strong>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>Your Events</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <Calendar
                    tileContent={renderEvents}
                    // Other calendar props as necessary
                />
            )}
        </Modal>
    );
};

export default CalendarModal;
