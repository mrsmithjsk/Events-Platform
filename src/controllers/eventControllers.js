const Event = require('../models/event');
const {syncEventToGoogleCalendar} = require('../services/googleSync');

exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      price: req.body.price,
      createdBy: req.user.id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Join an event
exports.joinEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id; // From the protect middleware
  const user = req.user; // The authenticated user

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already a participant
    const isAlreadyParticipant = event.participants.some(participant =>
      participant.userId.toString() === userId
    );

    if (isAlreadyParticipant) {
      return res.status(400).json({ message: 'User already joined the event' });
    }

    // Add user to participants array
    const newParticipant = {
      userId: userId,
      hasPaid: true
    };

    event.participants.push(newParticipant);
    await event.save();

    // // Sync event to Google Calendar if user has tokens
    // if (user.googleAccessToken && user.googleRefreshToken) {
    //   console.log('User tokens are present, proceeding to sync...');
    //   // Call the sync function and await its result
    //   const syncResult = await syncEventToGoogleCalendar(req,res); // Call sync without res

    //   if (syncResult.error) {
    //     // If there was an error syncing, handle it here
    //     return res.status(500).json({ message: syncResult.message });
    //   }
    // } else {
    //   console.error('No valid Google tokens found for user:', user.email);
    //   return res.status(400).json({ message: 'User does not have valid Google tokens' });
    // }


    res.status(200).json({ message: 'Successfully joined the event', event });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};