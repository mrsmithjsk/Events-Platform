const Event = require('../models/event');

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
