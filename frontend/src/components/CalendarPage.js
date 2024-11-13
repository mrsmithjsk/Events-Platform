import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import '../App.css';
// import { useAuth } from '../AuthProvider';
// import { useNavigate } from 'react-router-dom';

// const CalendarPage = () => {
//     const [userEvents, setUserEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { token, refreshAccessToken } = useAuth();
//     const navigate = useNavigate();

//     const isTokenExpired = (token) => {
//         if (!token) return true;
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const expirationTime = payload.exp * 1000;
//         return expirationTime < Date.now();
//     };

//     useEffect(() => {
//         const fetchUserEvents = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 let currentToken = token;

//                 if (isTokenExpired(token)) {
//                     currentToken = await refreshAccessToken();
//                     if (!currentToken) {
//                         alert('Session expired. Please log in again.');
//                         navigate('/login');
//                         return;
//                     }
//                 }

//                 const response = await fetch('https://events-platform-cyfi.onrender.com/api/events/userEvents', {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${currentToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                     credentials: 'include',
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch events');
//                 }

//                 const data = await response.json();
//                 const formattedEvents = data.map(event => ({
//                     title: event.title,
//                     start: event.start,
//                     end: event.end,
//                     description: event.description
//                 }));
//                 setUserEvents(formattedEvents);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserEvents();
//     }, [token, refreshAccessToken, navigate]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div style={{ height: '100vh', padding: '20px' }}>
//             <button onClick={() => navigate('/events')}>Back to Events</button>
//             <div style={{ height: '90%', marginTop: '20px' }}>
//                 <FullCalendar
//                     plugins={[dayGridPlugin]}
//                     initialView="dayGridMonth"
//                     events={userEvents}
//                 />
//             </div>
//         </div>
//     );
// };


const CalendarPage = () => {
    return (
        <div style={{ margin: '50px' }}>
            <div style={{ height: '800px' }}>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                        { title: 'Test Event', date: '2024-03-20' }
                    ]}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
