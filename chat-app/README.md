# WhatsApp-like Chat App with Admin Panel

## Project Structure

- backend/: Node.js server with Express and Socket.IO
- frontend/: React app with chat UI and admin panel UI

## Setup and Run

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install express socket.io cors
   ```

3. Start the server:
   ```
   node server.js
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React app:
   ```
   npm start
   ```

4. Open your browser at `http://localhost:3000`

## Features

- User registration and login (username only)
- Real-time one-on-one chat using Socket.IO
- Chat message history stored in memory
- Admin panel to view users and messages (to be implemented)
- Responsive design with Tailwind CSS

## Notes

- This is a basic implementation and does not include persistent storage or authentication security.
- The admin panel UI and features will be added in the next steps.
