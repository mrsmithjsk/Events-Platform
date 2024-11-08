import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './AuthProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://events-platform-cyfi.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);

                const decoded = JSON.parse(atob(data.token.split('.')[1]));
                localStorage.setItem('user', JSON.stringify({ id: decoded.id, role: decoded.role }));
                setToken(data.token);
                setMessage('Login successful!');
                navigate('/events');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error logging in.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {loading ? ( // Display loading message if loading
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-required="true"
                        aria-describedby="emailHelp"
                    />
                    <p id="emailHelp" style={{ visibility: "hidden" }}>
                        Enter your email address
                    </p>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-required="true"
                        aria-describedby="passwordHelp"
                    />
                    <p id="passwordHelp" style={{ visibility: "hidden" }}>
                        Enter your password
                    </p>
                    <button type="submit">Login</button>
                </form>
            )}
            {message && <p role="alert">{message}</p>}
        </div>
    );
};

export default Login;
