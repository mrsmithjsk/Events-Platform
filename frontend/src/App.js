import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import CreateEvent from './components/CreateEvent';
import EventList from './components/EventList';
import PaymentSuccess from './components/PaymentSuccess';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Event Platform</h1>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="*" element={<h2>Page Not Found</h2>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
