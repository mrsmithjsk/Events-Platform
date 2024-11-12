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

    const tileContent = ({ date, view }) => {
        if (view !== 'month') return null;

        const eventsOnDate = userEvents.filter(event =>
            new Date(event.start).toDateString() === date.toDateString()
        );

        return eventsOnDate.length > 0 ? (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}
                title={`${eventsOnDate.length} event(s)`}
            >
                <div style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '12px',
                    margin: '2px auto'
                }}>
                    {eventsOnDate.length}
                </div>
            </div>
        ) : null;
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    padding: '20px',
                    borderRadius: '8px',
                }
            }}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Events</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <Calendar
                    tileContent={tileContent}
                    className="calendar-container"
                    aria-label="User Events Calendar"
                />
            )}
        </Modal>
    );
};

export default CalendarModal;

