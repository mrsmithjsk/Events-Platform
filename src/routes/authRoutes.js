const express = require('express');
const { register, login } = require('../controllers/authControllers');
const { oAuth2Client } = require('../services/googleClient')
const router = express.Router();
const User = require('../models/user');

router.post('/register', register);

router.post('/login', login);

router.post('/set-email', (req, res) => {
    const { email } = req.body; 
    req.session.userEmail = email; 
    res.sendStatus(200); 
});

router.get('/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        redirect_uri: process.env.REDIRECT_URI, // Ensure this uses the new URI
    });
    res.redirect(authUrl);
});

router.get('/google/redirect', async (req, res) => { 
    const { code } = req.query; 

    const email = req.session.userEmail;

    try {
        const { tokens } = await oAuth2Client.getToken(code); 
        oAuth2Client.setCredentials(tokens);
        
        let user = await User.findOne({ email }); 


        if (user) {
            user.googleAccessToken = tokens.access_token;
            user.googleRefreshToken = tokens.refresh_token;
            await user.save();
        } else {
            return res.status(404).send('User not found. Please register first.');
        }
        res.redirect('https://main--events-platform-01.netlify.app/events'); // Adjust this to redirect to your frontend
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Error during authentication');
    }
});


module.exports = router;
