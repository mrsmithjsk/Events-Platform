import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        return eachDayOfInterval({ start, end });
    };

    const days = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const eventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <button onClick={previousMonth}>&lt;</button>
                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>
            
            <div className="calendar-days-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="day-name">{day}</div>
                ))}
            </div>
            
            <div className="calendar-grid">
                {days.map((day, index) => {
                    const dayEvents = eventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    
                    return (
                        <div 
                            key={day.toString()} 
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''}`}
                        >
                            <div className="day-number">{format(day, 'd')}</div>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <div key={event.id} className="event" title={event.title}>
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