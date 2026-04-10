# Online Quiz Application

A full-stack Online Quiz Application built with Node.js, Express, MongoDB, and vanilla JavaScript. Includes authentication and role-based access control so only admins can manage questions and view all results.

## Technology Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript, Fetch API
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose ODM)

## Features

- User registration and login with JWT authentication
- Role-based access (user, admin)
- Randomized quiz questions with fixed number of questions
- Global timer and automatic submission when time ends
- Instant score calculation and result display
- Admin-only question management (add / edit / delete)
- Admin-only view of all quiz results
- RESTful APIs with JSON payloads

## Installation

1. Clone the repository and open the `OnlineQuizApp/backend` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env` (see `.env` example in documentation).

4. Start MongoDB locally (e.g., `mongod`).

5. Start the server:

   ```bash
   npm start
   ```

6. Open the frontend in browser at:
