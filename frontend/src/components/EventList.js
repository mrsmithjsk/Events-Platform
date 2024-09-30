import React, { useEffect, useState } from 'react';
import CreateEvent from './CreateEvent';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51PycamK5UIKOqrVgOFuOsT0tINgPlMwGAYw3qAnWH9Hrzn5bdZz6q8244X0flO7OV8rzod8xW55cCgCZZhdr28mB00yDTqDRxD");

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No valid token found');
                }

                const response = await fetch('https://events-platform-cyfi.onrender.com/api/events', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    throw new Error('Expected an array of events');
                }

                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.role === 'admin') {
                    setIsAdmin(true);
                }

                if (user && user.id) {
                    setUserId(user.id);
                }

                const googleLoginStatus = localStorage.getItem('isGoogleLoggedIn');
                setIsGoogleLoggedIn(googleLoginStatus === 'true');

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleGoogleLogin = async () => {
        const email = localStorage.getItem('userEmail');

        if (!email) {
            alert('Email not found. Please log in or register first.');
            return;
        }

        await fetch('https://events-platform-cyfi.onrender.com/api/auth/set-email', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });
        if (response.ok) {
            window.location.href = 'https://events-platform-cyfi.onrender.com/api/auth/google';
        } else {
            alert('Failed to set email. Please try again.');
        }
    };


    const handleJoinEvent = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://events-platform-cyfi.onrender.com/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ eventId })
            });

            const data = await response.json();

            if (response.ok && data.sessionId) {
                const stripe = await stripePromise;

                const result = await stripe.redirectToCheckout({
                    sessionId: data.sessionId,
                });

                if (result.error) {
                    console.error('Stripe checkout error:', result.error.message);
                }
            } else {
                alert('Error creating checkout session');
            }
        } catch (error) {
            console.error('Error joining event:', error);
        }
    };



    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    if (loading) {
        return <div>Loading events...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Event List</h2>
            {!isGoogleLoggedIn && (
                <button onClick={handleGoogleLogin} aria-label="Login with Google">Login with Google</button>
            )}
            {isAdmin && (
                <button onClick={openModal} aria-label="Create Event">Create Event</button>
            )}
            {events.length === 0 ? (
                <p>No events available</p>
            ) : (
                <ul>
                    {events.map((event) => (
                        <li key={event._id}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.date).toLocaleString()}</p>
                            <p>Price: £{event.price}</p>
                            <button
                                onClick={() => handleJoinEvent(event._id)}
                                disabled={event.participants.some(participant => participant.userId === userId)}
                            >
                                {event.participants.some(participant => participant.userId === userId) ? 'Joined' : 'Join'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {showModal && <CreateEvent closeModal={closeModal} />}
        </div>
    );
};

export default EventList;
