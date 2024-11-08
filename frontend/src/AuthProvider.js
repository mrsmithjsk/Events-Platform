import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null); 
    const [refreshToken, setRefreshToken] = useState(null); 

    const refreshAccessToken = async () => {
        try {
            const response = await fetch('https://events-platform-cyfi.onrender.com/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }), 
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.accessToken); 
                setRefreshToken(data.refreshToken);
                return data.accessToken;
            } else {
                console.error('Failed to refresh token');
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };
    
    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
