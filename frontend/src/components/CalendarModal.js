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

            const response = await fetch('https://events-platform-cyfi.onrender.com/api/userEvents', {
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

    useEffect(() => {
        if (isOpen) {
            fetchUserEvents();
        }
    }, [isOpen, token]); //only runs when modal is opened or token changes

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
            <>
                {eventsOnDate.map((event, index) => (
                    <div key={index} className="event">
                        <strong>{event.title}</strong>
                        <p>{event.description}</p>
                    </div>
                ))}
            </>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="User Event Calendar"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '600px',
                },
            }}
        >
            <h2>User Event Calendar</h2>
            {loading && <p>Loading events...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <Calendar
                    tileContent={renderEvents}
                    tileClassName={({ date, view }) => {
                        if (
                            userEvents.some(
                                event =>
                                    new Date(event.start).toDateString() === date.toDateString()
                            )
                        ) {
                            return 'highlight';
                        }
                        return null;
                    }}
                />
            )}
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};

export default CalendarModal;
