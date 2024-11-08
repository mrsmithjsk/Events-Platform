import React, { useState } from 'react';
import '../App.css';
import { useAuth } from '../AuthProvider';

const CreateEvent = ({ closeModal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const { token, refreshToken, refreshAccessToken } = useAuth();

    const isTokenExpired = (token) => {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return expirationTime < Date.now();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let currentToken = token;

            if (isTokenExpired(token)) {
                currentToken = await refreshAccessToken();
            }

            const response = await fetch('https://events-platform-cyfi.onrender.com/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`,
                },
                credentials: 'include',
                body: JSON.stringify({ title, description, date, price }),
            });

            if (response.ok) {
                alert('Event created successfully!');
                setTitle('');
                setDescription('');
                setDate('');
                setPrice('');
                closeModal();

                window.location.reload();
            } else {
                alert('Error creating event');
            }
        } catch (error) {
            alert('Error: Please log in again');
        }
    };

        return (
            <div className="modal">
                <div className="modal-content">
                    <h2>Create New Event</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="eventTitle">Event Title</label>
                            <input
                                id="eventTitle"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Event Title"
                                required
                                aria-required="true"
                                aria-label="Event Title"
                            />
                        </div>
                        <div>
                            <label htmlFor="eventDescription">Event Description</label>
                            <textarea
                                id="eventDescription"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Event Description"
                                required
                                aria-required="true"
                                aria-label="Event Description"
                            />
                        </div>
                        <div>
                            <label htmlFor="eventDate">Event Date</label>
                            <input
                                id="eventDate"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                aria-required="true"
                                aria-label="Event Date"
                            />
                        </div>
                        <div>
                            <label htmlFor="eventPrice">Event Price</label>
                            <input
                                id="eventPrice"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Event Price"
                                required
                                aria-required="true"
                                aria-label="Event Price"
                            />
                        </div>
                        <button type="submit">Create Event</button>
                        <button type="button" onClick={closeModal}>Cancel</button>
                    </form>
                </div>
            </div>
        );
    };

    export default CreateEvent;
