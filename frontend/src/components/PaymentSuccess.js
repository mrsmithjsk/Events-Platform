import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        //const token = localStorage.getItem('token'); 
        //console.log("Token on Payment Success:", token);
        if (!token) {
            console.error('Token is missing or expired.');
            alert('You need to log in to access this feature.');
            navigate('/login'); 
            return; 
        }

        if (sessionId) {
            const handlePaymentSuccess = async (sessionId) => {
                try {
                    const response = await fetch(`https://events-platform-cyfi.onrender.com/api/stripe/payment-success?session_id=${sessionId}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert(`You have joined event "${data.eventTitle}"!`);

                        if (data.calendarSyncMessage) {
                            alert(data.calendarSyncMessage);
                        }
                        
                        navigate('/events');
                    } else {
                        alert('Error processing payment');
                    }
                } catch (error) {
                    console.error('Error processing payment success:', error);
                }
            };

            handlePaymentSuccess(sessionId);
        } else {
            navigate('/events');
        }
    }, [location, navigate]);


    return <div>Processing payment...</div>;
};

export default PaymentSuccess;
