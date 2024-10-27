const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');
const Event = require('../models/event');
const { syncEventToGoogleCalendar } = require('../services/googleSync');

exports.createCheckoutSession = async (req, res) => {
  const { eventId } = req.body;


  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    //free event => skip Stripe checkout
    if (event.price === 0) {
      const userId = req.user.id;

      //add user to event participants
      const existingParticipant = event.participants.find(participant => participant.userId.toString() === userId.toString());
      if (!existingParticipant) {
        event.participants.push({ userId: userId, hasPaid: false }); // hasPaid false for free event
        await event.save();
      }

      //Google Calendar sync
      const user = await User.findById(userId);
      let calendarSyncMessage = null;
      if (user.googleAccessToken && user.googleRefreshToken) {
        try {
          await syncEventToGoogleCalendar(eventId, user);
          calendarSyncMessage = 'Event successfully synced to your Google Calendar!';
        } catch (error) {
          console.error('Error syncing to Google Calendar:', error.message);
          calendarSyncMessage = 'Failed to sync event to Google Calendar.';
        }
      }

      //successful response
      return res.status(200).json({
        message: 'Successfully joined the free event!',
        eventTitle: event.title,
        calendarSyncMessage,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: event.title,
            },
            unit_amount: event.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://main--events-platform-01.netlify.app/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://main--events-platform-01.netlify.app/events',
      metadata: {
        eventId: String(eventId)
      }
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ message: 'Server error while creating Stripe session' });
  }
};

exports.paymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const eventId = session.metadata.eventId;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingParticipant = event.participants.find(participant => participant.userId.toString() === userId.toString());
    if (!existingParticipant) {
      event.participants.push({ userId: userId, hasPaid: true });
      await event.save();
    }

    const user = await User.findById(userId);
    let calendarSyncMessage = null;
    if (user.googleAccessToken && user.googleRefreshToken) {
      console.log('User has Google tokens, proceeding with sync...');
      try {
        await syncEventToGoogleCalendar(eventId, user);
        calendarSyncMessage = 'Event successfully synced to your Google Calendar!';
      } catch (error) {
        console.error('Error syncing to Google Calendar:', error.message);
        calendarSyncMessage = 'Failed to sync event to Google Calendar.';
      }
    }

    res.status(200).json({
      message: 'Successfully joined the event!',
      eventTitle: event.title,
      calendarSyncMessage
    });
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

