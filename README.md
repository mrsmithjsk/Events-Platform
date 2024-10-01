# Event Platform

Welcome to the Event Platform! This application allows users to create and sign up for events while integrating with Google Calendar for managing event schedules.

## Hosted Sites

- **Frontend:** [Event Platform Frontend](https://events-platform-01.netlify.app/)
- **Backend:** [Event Platform Backend](https://events-platform-cyfi.onrender.com/)

## Features

- User registration and login.
- Admin functionality to create events.
- Users can view and join events.
- Integration with Stripe for payments.
- Events synced to Google Calendar for easy management.

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


### Note
Since hosting, I have a problem with CORS. This is causing issues with the frontend and backend communicating; redirecting uris and reloading pages.