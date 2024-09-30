const Event = require('../models/event');
const { google } = require('googleapis');
const { oAuth2Client } = require('./googleClient');

exports.syncEventToGoogleCalendar = async (eventId, user) => {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        console.error(`Event not found with ID: ${eventId}`);
        return;
      }
  
      oAuth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
      });
  
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
      const startTime = new Date(event.date).toISOString();
      const endTime = new Date(new Date(event.date).setHours(new Date(event.date).getHours() + 1)).toISOString();
  
      const calendarEvent = {
        summary: event.title,
        description: event.description,
        start: { dateTime: startTime, timeZone: 'UTC' },
        end: { dateTime: endTime, timeZone: 'UTC' },
      };
  
      await calendar.events.insert({ calendarId: 'primary', resource: calendarEvent });
    } catch (error) {
      console.error('Error syncing event to Google Calendar:', error.message);
    }
  };
  