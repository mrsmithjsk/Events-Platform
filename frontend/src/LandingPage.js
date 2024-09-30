import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const LandingPage = () => {
    return (
        <div>
            <h2>Welcome to the Event Platform</h2>
            <h3>Sign Up to Get Started!</h3>
            <Link to="/register">
                <button>Sign Up</button>
            </Link>
            <p>Already have an account? <Link to="/login">Log in here</Link>.</p>
        </div>
    );
};

export default LandingPage;
