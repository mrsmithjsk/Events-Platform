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
        console.log('Session state:', req.session);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.get('/google', (req, res) => {
    const email = req.session.userEmail;
    console.log('User email before redirect:', email);
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email'],
        redirect_uri: process.env.REDIRECT_URI, 
    });
    res.redirect(authUrl);
});

router.get('/google/redirect', async (req, res) => {
    console.log('Redirect endpoint hit:', req.query);
    console.log('Session state at redirect:', req.session);
    const { code } = req.query;

    //const email = req.session.userEmail;
    //console.log('User email from state:', email);
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens received:', tokens);

        const userInfoResponse = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo'
        });

        const email = userInfoResponse.data.email; 
        console.log('User email retrieved from Google:', email);

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
