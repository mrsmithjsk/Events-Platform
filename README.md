# Event Platform

Welcome to the Event Platform! This application allows users to create and sign up for events while integrating with Google Calendar for managing event schedules.

## Hosted Sites

- **Frontend:** [Event Platform Frontend](https://events-platform-01.netlify.app/)
- **Backend:** [Event Platform Backend](https://events-platform-cyfi.onrender.com/)

## Test Accounts

To help you explore the platform quickly, here are some pre-configured test accounts:

### Admin Account (For creating events)
- **Email:** `admin@example.com`
- **Password:** `admin123`

### User Accounts (For signing up and joining events)
- **User 1:**  
  - **Email:** `123bobobobbob123@gmail.com`
  - **Password:** `bob`


## Features

- **User registration and login:** Easily sign up or log in using a test account or your own credentials.
- **Admin functionality:** Admins can create new events, which are then visible to all users.
- **Event sign-up and payment:** Users can browse and sign up for events. Once an event is joined and paid for (using Stripe), it will be added to the user's Google Calendar.
- **Google Calendar Integration:** Sync your joined events directly to Google Calendar for better event management.
- **Stripe Payment Gateway:** Secure and easy payment integration using Stripe.

## Tech Stack

### Frontend

- **React**: The core library for building the user interface.
- **Netlify**: For frontend deployment and hosting.

### Backend

- **Node.js**: The JavaScript runtime for the backend.
- **Express**: A web framework for Node.js.
- **MongoDB**: A NoSQL database used to store user and event data.
- **Mongoose**: A library for MongoDB object modelling.
- **JWT (jsonwebtoken)**: For handling user authentication.
- **Google APIs (google-auth-library, googleapis)**: Used for Google OAuth and Calendar integration.
- **Stripe**: For handling payment processing.
- **Bcrypt & bcryptjs**: For password hashing and validation.
- **Express-Session & Connect-Mongo**: For managing user sessions with MongoDB as a store.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **Axios**: For making HTTP requests to third-party APIs.
- **Render**: For backend deployment and hosting.

## Getting Started

### Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A MongoDB account (for the backend)
- A Google account for OAuth integration

### Clone the Repository

1. Open your terminal or command prompt.
2. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/your-username/event-platform.git
   cd event-platform
3. Run command 
   ```bash
   npm start
4. Open a second terminal and run commands:
   ```bash
   cd frontend
   npm start

Your local environment will be set up and running. The frontend will be available at [http://localhost:3000](http://localhost:3000), and the backend will be available at [http://localhost:8081](http://localhost:8081).

## Future Enhancements

- **Enhanced Event Filtering:** Adding search and filter functionality for events based on date, location, and category.
- **Notifications:** Implementing real-time notifications for event reminders and updates.
- **Profile Customisation:** Allowing users to customise their profiles and manage their event history.