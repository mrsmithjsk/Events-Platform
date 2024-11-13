import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enGB from 'date-fns/locale/en-GB'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const locales = {
    'en-GB': enGB
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: enGB }),
    getDay,
    locales,
});

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen p-4 bg-gray-50">
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
                
                <div className="bg-white rounded-lg shadow p-4" style={{ height: '700px' }}>
                    <Calendar
                        localizer={localizer}
                        events={userEvents}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectEvent={handleEventSelect}
                        style={{ height: '100%' }}
                        views={['month', 'week', 'day']}
                        defaultView="month"
                        tooltipAccessor={event => event.description}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
