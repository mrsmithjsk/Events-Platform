import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
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

                if (isTokenExpired(token)) {
                    currentToken = await refreshAccessToken();
                    if (!currentToken) {
                        alert('Session expired. Please log in again.');
                        navigate('/login');
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
                const formattedEvents = data.map(event => ({
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    description: event.description
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

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Events Calendar</h2>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Events
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading...</p>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-4 h-[700px]">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={userEvents}
                            eventContent={(eventInfo) => (
                                <div className="text-sm">
                                    <div className="font-semibold">{eventInfo.event.title}</div>
                                    {eventInfo.event.extendedProps.description && (
                                        <div className="text-xs">{eventInfo.event.extendedProps.description}</div>
                                    )}
                                </div>
                            )}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: ''
                            }}
                            height="100%"
                            dayMaxEvents={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
