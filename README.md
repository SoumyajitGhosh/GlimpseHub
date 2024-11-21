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
- **Frontend**: React
- **State management**: Redux
- **Routing**: React Router
- **Form management**: Formik
- **Animations**: React Spring
- **Websocket management**: Socket.io
- **Backend**: Express
- **Database**: MongoDB
- **Image hosting**: Cloudinary

## Areas to improve on
- Use redis to store the users connected via socket.
- Scaling of the application.
- Creation of a CI/CD pipeline.
- Dockerize the application.
- Add analytics to it.


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

4. **Set up environment variables:**
   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

5. **Start the development servers:**
   ```bash
   # In the backend directory
   npm run dev
    
   # In the frontend directory
   npm start

