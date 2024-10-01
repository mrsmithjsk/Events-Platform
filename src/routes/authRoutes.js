const express = require('express');
const { register, login } = require('../controllers/authControllers');
const { oAuth2Client } = require('../services/googleClient')
const router = express.Router();
const User = require('../models/user');

router.post('/register', register);

router.post('/login', login);

router.post('/set-email', (req, res) => {
    const { email } = req.body;
    if (email) {
        req.session.userEmail = email;
        console.log('Email set in session:', req.session.userEmail);
        console.log('Email set in session 2:', email);
        console.log('Session ID:', req.sessionID);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.get('/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        redirect_uri: process.env.REDIRECT_URI, 
        state: JSON.stringify({ email: req.session.userEmail }),
    });
    res.redirect(authUrl);
});

router.get('/google/redirect', async (req, res) => {
    console.log('Redirect endpoint hit:', req.query);
    const { code } = req.query;
    console.log('Full session object:', req.session);
    //const email = req.session.userEmail;
    const { email } = JSON.parse(state);
    console.log('User email from session:', email);
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens received:', tokens);

        let user = await User.findOne({ email });
        console.log('User retrieved from DB:', user);


        if (user) {
            user.googleAccessToken = tokens.access_token;
            user.googleRefreshToken = tokens.refresh_token;
            await user.save();
        } else {
            return res.status(404).send('User not found. Please register first.');
        }
        res.redirect('https://main--events-platform-01.netlify.app/events'); //redirect to frontend
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Error during authentication');
    }
});


module.exports = router;
