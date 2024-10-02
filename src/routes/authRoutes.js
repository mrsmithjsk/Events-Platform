const express = require('express');
const { register, login } = require('../controllers/authControllers');
const { oAuth2Client } = require('../services/googleClient')
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/register', register);

router.post('/login', login);

router.post('/set-email', (req, res) => {
    const { email } = req.body;
    if (email) {
        req.session.userEmail = email;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

router.get('/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email'],
        redirect_uri: process.env.REDIRECT_URI,
    });
    res.redirect(authUrl);
});

router.get('/google/redirect', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log('Tokens received from Google:', tokens);
        oAuth2Client.setCredentials(tokens);

        const userInfoResponse = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo'
        });
        const email = userInfoResponse.data.email;

        let user = await User.findOne({ email });
        if (user) {
            user.googleAccessToken = tokens.access_token;
            user.googleRefreshToken = tokens.refresh_token;
            await user.save();
        } 
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true });

        return res.redirect('https://main--events-platform-01.netlify.app/events');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Error during authentication');
    }
});


module.exports = router;
