# GlimpseHub

GlimpseHub is a cutting-edge social networking and content creation platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It offers users a seamless experience to connect, share, and create content.

## Features
- **User Authentication**: Secure user registration and login functionalities.
- **Profile Management**: Personalized user profiles with customizable information.
- **Content Creation**: Tools for creating and sharing posts, images, and other media.
- **Increased Interactiveness**: Tag people in comments, reply to a comment. Reply to a reply.
- **Optimized Search**: Search by hashtags.
- **Real-time Updates**: Instant notifications and updates using WebSockets.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Real-time Chats**: Chat with users that you're following.

## Tech Stack used
- **Frontend**: React 19 + TypeScript (Vite)
- **State management**: Redux Toolkit
- **Routing**: React Router 7
- **Form management**: Formik
- **Animations**: `@react-spring/web`
- **Websocket management**: Socket.io
- **Backend**: Express
- **Database**: MongoDB (Mongoose)
- **Image hosting**: Cloudinary
- **CI**: GitHub Actions (lint/test/build on every PR)

## Areas to improve on
- Use redis to store the users connected via socket (currently in-memory, single-instance only).
- Scaling of the application.
- Dockerize the application.
- Add analytics to it.
- A real backend test runner (`npm test` in `backend/` is currently a placeholder).

See [`SETUP_NOTES.md`](./SETUP_NOTES.md) for the full development history and everything
that's already been done.


## Installation

To set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SoumyajitGhosh/GlimpseHub.git

2. **Navigate to the project directory:**
   ```bash
   cd GlimpseHub

3. **Install dependencies for both backend and frontend:**
   ```bash
   # For backend
    cd backend
    npm install

   # For frontend
    cd ../frontend
    npm install

4. **Set up environment variables** — each package has a `.env.example` to copy:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Then fill in real values in `backend/.env` (Cloudinary credentials, a `JWT_SECRET`, SMTP
   if you want confirmation emails to actually send). No local MongoDB? Run `npm run
   dev:mongo` in `backend/` for a disposable in-memory one — it listens on the exact
   `MONGO_URI` the example file already has. `frontend/.env` works as-is for local dev.

5. **Start the development servers** (each has no watcher — restart manually after backend edits):
   ```bash
   # In the backend directory
   npm run dev

   # In the frontend directory
   npm run dev
   ```

