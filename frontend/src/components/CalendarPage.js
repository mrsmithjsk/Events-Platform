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
                    description: event.description,
                    allDay: true
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
        <div>
            <button onClick={() => navigate('/events')}>
                Back to Events
            </button>
            
            <div style={{ 
                height: '90vh',
                minHeight: '900px',
                width: '100%'
            }}>
                <Calendar
                    localizer={localizer}
                    events={userEvents}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    views={['month', 'day']}
                    style={{ width: '100%', height: '100%' }}
                    popup
                    tooltipAccessor={event => `${event.title}: ${event.description}`}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
