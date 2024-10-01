const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB, createAdminUser } = require('./db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

const allowedOrigins = [
    'https://events-platform-01.netlify.app',
    'https://events-platform-cyfi.onrender.com',
];

app.use(cors({
    origin: function (origin, callback) {
        console.log('Received Origin:', origin);
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.options('*', cors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: { secure: true, sameSite: 'none', maxAge: 1000 * 60 * 60 * 24 }
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
        const dbUri = process.env.MONGO_URI || process.env.TEST_MONGO_URI;
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

