import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek
} from 'date-fns';

const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    const getDaysInMonth = (date) => {
        const start = startOfWeek(startOfMonth(date));
        const end = endOfWeek(endOfMonth(date));
        return eachDayOfInterval({ start, end });
    };

    const eventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeEventDetails = () => {
        setSelectedEvent(null);
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="custom-calendar">
            {selectedEvent && (
                <div className="event-modal-overlay" onClick={closeEventDetails}>
                    <div className="event-modal" onClick={e => e.stopPropagation()}>
                        <div className="event-modal-header">
                            <h3>Event Details</h3>
                            <button className="close-button" onClick={closeEventDetails}>&times;</button>
                        </div>
                        <div className="event-modal-content">
                            <p><strong>Event:</strong> {selectedEvent.title}</p>
                            {selectedEvent.description && (
                                <p><strong>Description:</strong> {selectedEvent.description}</p>
                            )}
                            <p><strong>Date:</strong> {format(new Date(selectedEvent.start), 'dd/MM/yyyy')}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="calendar-header">

                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="calendar-nav-buttons">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                        Previous
                    </button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                        Next
                    </button>
                </div>
            </div>

            <div className="calendar-days-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="day-name">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {days.map((day) => {
                    const dayEvents = eventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                        <div
                            key={day.toString()}
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''}`}
                        >
                            <div className="day-number">
                                {format(day, 'd')}
                            </div>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="event"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;