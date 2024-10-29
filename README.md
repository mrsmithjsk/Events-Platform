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
- A Stripe account for payment processing

### Setup Instructions

1. **Clone the Repository**

   - Open your terminal or command prompt.
   - Run the following command to clone the repository:

     ```bash
     git clone https://github.com/your-username/event-platform.git
     cd event-platform
     ```

2. **Install Dependencies**

   - For both the frontend and backend, install the necessary packages:

     ```bash
     npm install
     ```

## 3. Set Up MongoDB

### Cloud MongoDB (Atlas):

1. Go to the MongoDB Atlas website (https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Once logged in, click "Build a Database" to create a new cluster.
3. Choose the "Free" tier option (M0 Sandbox).
4. Select your preferred cloud provider and region.
5. Click "Create Cluster".
6. In the Security Quickstart:
- Create a database user with a secure password.
- Add your current IP address to the IP Access List.
7. Click "Connect" on your cluster, then "Connect your application".
8. Copy the provided connection string.
9. Replace the `MONGO_URI` in the `.env` file with your Atlas connection string, replacing <password> in the connection string with your actual database user password.

### Local MongoDB:

1. Download MongoDB Community Server from the official website (https://www.mongodb.com/try/download/community).
2. Follow the installation instructions for your operating system.
3. Start the MongoDB service locally and use `mongodb://localhost:27017/events-platform` for the `MONGO_URI`.

## 4. Set Up Stripe

1. Go to the Stripe website (https://stripe.com) and sign up for an account.
2. Complete the account verification process.
3. Once your account is set up, go to the Stripe Dashboard.
4. In the dashboard, click on "Developers" in the left sidebar.
5. Click on "API keys" in the submenu.
6. You'll see your publishable key and a hidden secret key. Click "Reveal test key" to see your secret key.
7. Obtain your `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`.
8. Update your `.env` file with these keys.

### Testing Payments

- Use the following test card numbers to simulate payments:
  - **Visa**: `4242 4242 4242 4242` (Any future expiry date e.g. 11/34, any CVC e.g. 123)
  - **MasterCard**: `5555 5555 5555 4444` (Any future expiry date, any CVC)
- When testing, transactions will simulate successful payments but won’t process real funds - check the Stripe dashboard's transactions section to confirm if payments are processing.

## 5. Set Up Google API

1. Go to the Google Cloud Console and create a new project.
2. Enable the Google Calendar API for your project:
- In the dashboard, click "Enable APIs and Services"
- Search for "Google Calendar API" and select it
- Click "Enable"
3. Configure the OAuth consent screen:
- In the left sidebar, go to "APIs & Services" > "OAuth consent screen"
- Set the User Type to "External"
- Fill in the required fields (App name, User support email, Developer contact information)
- Add "/auth/calendar.events" and "/auth/userinfo.email" to the scopes
- Add your email address as a test user
- Click "Save and Continue"
4. Create OAuth 2.0 credentials:
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" and select "OAuth client ID"
- Choose "Web application" as the application type
- Set the authorised JavaScript origins to "http://localhost:8081"
- Set the authorised redirect URI to http://localhost:8081/api/auth/google/redirect for local development
- Click "Create"
5. Obtain your CLIENT_ID and CLIENT_SECRET, and add them to your .env file. After creating the OAuth client, you'll see a modal with your Client ID and Client Secret - these are the values to be copied into your .env file
6. Create an API Key:
- In the Credentials page, click "Create Credentials" again and select "API Key"
- Copy the generated API key and add it to your .env file
7. Add authorised domains:
- In the OAuth consent screen settings, add localhost to the list of authorised domains for testing
8. Set up test users:
- In the OAuth consent screen settings, add your Google account email as a test user.


## 6. Configure Environment Variables

Ensure your `.env` file in the root of the project contains the following variables:

```plaintext
PORT=8081                       # The port the server will run on
MONGO_URI=your_mongo_uri_here  # MongoDB connection string
JWT_SECRET=your_jwt_secret     # Secret for JWT authentication
STRIPE_SECRET_KEY=your_stripe_secret_key  # Stripe secret key for payment processing
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key  # Stripe public key for frontend
ADMIN_EMAIL=admin@example.com   # Admin email for the test account
ADMIN_PASSWORD=admin123         # Admin password for the test account
CLIENT_ID=your_google_client_id  # Google OAuth client ID
CLIENT_SECRET=your_google_client_secret  # Google OAuth client secret
REDIRECT_URI=http://localhost:8081/api/auth/google/callback  # Redirect URI for Google OAuth
GOOGLE_CALENDAR_KEY=your_google_calendar_key  # Key for accessing Google Calendar API
```

Replace `your_mongo_uri_here`, `your_jwt_secret`, `your_stripe_secret_key`, `your_stripe_publishable_key`, `your_google_client_id`, `your_google_client_secret`, and `your_google_calendar_key` with the actual values obtained from the services.


## 7. Update Configuration

Before running the application, make sure to replace any instances of real URLs with `localhost` in the codebase. Additionally, replace any placeholder keys and tokens in the code with your actual keys obtained from the respective services. Specifically, check:

1. **API URLs:** Change URLs to point to `http://localhost:8081` for backend requests. And update any frontend URLs in the code to point to `http://localhost:3000` as needed.
2. **Keys:** Update any API keys, secrets, and other configuration settings in the `.env` file and within the code, including any instances of keys like `loadStripe("pk_test_...")` found in the frontend code and the allowedOrigins found in the server.js file.


## 8. Run the Application
Start the backend server from the root of the project:

   ```bash
   npm start
   ```
Open a second terminal, navigate to the frontend directory, and start the frontend:

```bash
cd frontend
npm start
```
Your local environment will be set up and running. The frontend will be available at http://localhost:3000, and the backend will be available at http://localhost:8081.

## Future Enhancements

- **Enhanced Event Filtering:** Adding search and filter functionality for events based on date, location, and category.
- **Notifications:** Implementing real-time notifications for event reminders and updates.
- **Profile Customisation:** Allowing users to customise their profiles and manage their event history.
-**UI/UX Improvements:** Redesign the user interface for a more intuitive navigation experience, and style better such that it has a modern design aesthetic.

### Notes for Local Development

- The `netlify.toml` file does not affect local development. You can run the application locally without any issues, and the presence of this file is purely for deployment purposes on Netlify.

- If you encounter any issues while running the Event Platform locally, here are some common problems and their solutions:

**CORS Issues:**

When developing locally, you may encounter CORS issues due to the different protocols (HTTP vs. HTTPS) used by the frontend and backend. To avoid these issues, follow these steps:

1. In the `src/server.js` file, to configure the CORS middleware to allow all origins during local development. Set the `origin` option to `true`. This means that any request from your frontend will be accepted without being blocked by CORS.
   ```javascript
   app.use(cors({
       origin: true, //Allow all origins during local development
       credentials: true,
   }));
   ```
2. Secure Cookies: Ensure that the session cookie is not set to be secure during local development. In the same src/server.js file, set the secure option to false in the session configuration. This allows cookies to be sent over HTTP.
```javascript
app.use(session({
   // ... other options
    cookie: { secure: false, sameSite: 'Lax', maxAge: 1000 * 60 * 60 * 24 } //Set secure to false for local development
}));
```

**Database Connection Problems:**

Make sure that your MongoDB service is running if you are using a local MongoDB instance. If using MongoDB Atlas, verify your connection string and whitelist your IP address in the Atlas dashboard.

**Environment Variables Not Loaded:**

Ensure your .env file is correctly configured and located in the root directory of your project. If you make changes to the .env file, restart your backend server for the changes to take effect.

**Stripe Payment Issues:**

Verify that you have set the correct STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY in your .env file. Additionally, ensure that your Stripe account is in test mode while developing. Check the Stripe dashboard's transactions section to confirm if payments are processing.

**Google Authentication Issues:**

When using Google Authentication, you may encounter issues related to permissions and allowed origins. Consider the following:

1. **Allowed Origins**: Make sure that the localhost address is included in the list of allowed origins in your Google Cloud Console project ie on the website. This is essential for successful OAuth redirection during local development.

2. **Permissions**: Ensure that the Google account you are using for authentication has the necessary permissions to access the Google APIs you intend to use, ie the Google Calendar API. Review permissions in your Google Account settings under the "Security" section.

3. **Usage**: Be aware of the API usage quotas and limits set by Google for the Calendar API. 
