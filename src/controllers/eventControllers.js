const Event = require('../models/event');
const User = require('../models/user');

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

exports.getUserEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userEvents = await Event.find({
      'participants.userId': user._id,
      date: { $gte: new Date() }
    });

    const formattedEvents = userEvents.map(event => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      start: event.date.toISOString(),
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching user events:', error.message);
    res.status(500).json({ message: 'Failed to fetch user events.' });
  }
};
