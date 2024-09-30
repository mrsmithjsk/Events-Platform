const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectDB, createAdminUser } = require('./db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

const allowedOrigins = [
    'https://main--events-platform-01.netlify.app',
    'https://events-platform-cyfi.onrender.com'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: { secure: true, sameSite: 'None', maxAge: 1000 * 60 * 60 * 24 } // Set to true if using HTTPS
}));



app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stripe', stripeRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});


const startServer = async () => {
    try {
        const dbUri = process.env.MONGO_URI || process.env.TEST_MONGO_URI; // Use the appropriate URI
        await connectDB(dbUri);
        await createAdminUser();
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error connecting to DB', error.message);
    }
}
startServer();

module.exports = app;

